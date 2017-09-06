import { translate } from '../../translate/translate';
import {
  triggerToaster,
  getPassthruAgent,
  getKMDAddressesNative
} from '../actionCreators';
import Config from '../../config';

export function getNewKMDAddresses(coin, pubpriv, mode) {
  let payload;
  let ajaxFunctionInput = pubpriv === 'public' ? 'getnewaddress' : 'z_getnewaddress';

  if (getPassthruAgent(coin) === 'iguana') {
    payload = {
      userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
      agent: getPassthruAgent(coin),
      method: 'passthru',
      asset: coin,
      function: ajaxFunctionInput,
      hex: '',
    };
  } else {
    payload = {
      userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
      agent: coin,
      method: 'passthru',
      function: ajaxFunctionInput,
      hex: '',
    };
  }

  return dispatch => {
    let _fetchConfig = {
      method: 'POST',
      body: JSON.stringify(payload),
    };

    if (Config.cli.default) {
      payload = {
        mode: null,
        chain: coin,
        cmd: payload.function,
      };

      _fetchConfig = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: payload }),
      };
    }

    return fetch(
      Config.cli.default ? `http://127.0.0.1:${Config.agamaPort}/shepherd/cli` : `http://127.0.0.1:${Config.iguanaCorePort}`,
      _fetchConfig
    )
    .catch(function(error) {
      console.log(error);
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
      dispatch(
        triggerToaster(
          json.result ? json.result : json,
          translate('KMD_NATIVE.NEW_ADDR_GENERATED'),
          'info',
          false
        )
      );
      dispatch(getKMDAddressesNative(coin, mode));
    })
    .catch(function(ex) {
      dispatch(
        triggerToaster(
          json.result ? json.result : json,
          translate('KMD_NATIVE.NEW_ADDR_GENERATED'),
          'info',
          false
        )
      );
      dispatch(getKMDAddressesNative(coin, mode));
    });
  }
}