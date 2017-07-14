import { translate } from '../../translate/translate';
import {
  triggerToaster,
  Config,
  getPassthruAgent,
  getKMDAddressesNative
} from '../actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

function handleGetNewKMDAddresses(pubpriv, coin, dispatch, json) {
  dispatch(
    triggerToaster(
      json.result ? json.result : json,
      translate('KMD_NATIVE.NEW_ADDR_GENERATED'),
      'info',
      false
    )
  );
  dispatch(getKMDAddressesNative(coin));

  return {};
}

export function getNewKMDAddresses(coin, pubpriv) {
  let payload;
  let ajaxFunctionInput = pubpriv === 'public' ? 'getnewaddress' : 'z_getnewaddress';

  if (getPassthruAgent(coin) === 'iguana') {
    payload = {
      'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
      'agent': getPassthruAgent(coin),
      'method': 'passthru',
      'asset': coin,
      'function': ajaxFunctionInput,
      'hex': '',
    };
  } else {
    payload = {
      'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
      'agent': coin,
      'method': 'passthru',
      'function': ajaxFunctionInput,
      'hex': '',
    };
  }

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getNewKMDAddresses',
      'type': 'post',
      'url': Config.cli.default ? `http://127.0.0.1:${Config.agamaPort}/shepherd/cli` : `http://127.0.0.1:${Config.iguanaCorePort}`,
      'payload': payload,
      'status': 'pending',
    }));

    let _fetchConfig = {
      method: 'POST',
      body: JSON.stringify(payload),
    };

    if (Config.cli.default) {
      payload = {
        mode: null,
        chain: coin,
        cmd: payload.function
      };

      _fetchConfig = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'payload': payload }),
      };
    }

    return fetch(
      Config.cli.default ? `http://127.0.0.1:${Config.agamaPort}/shepherd/cli` : `http://127.0.0.1:${Config.iguanaCorePort}`,
      _fetchConfig
    )
    .catch(function(error) {
      console.log(error);
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'error',
        'response': error,
      }));
      dispatch(
        triggerToaster(
          'getNewKMDAddresses',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      if (Config.cli.default) {
        json = json.result;
      }
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(
        handleGetNewKMDAddresses(
          pubpriv,
          coin,
          dispatch,
          json
        )
      );
    })
    .catch(function(ex) {
      dispatch(
        handleGetNewKMDAddresses(
          pubpriv,
          coin,
          dispatch
        )
      );
    });
  }
}