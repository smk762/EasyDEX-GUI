import { SYNCING_NATIVE_MODE } from '../storeType';
import {
  triggerToaster,
  Config,
  getPassthruAgent,
  getDebugLog
} from '../actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function getSyncInfoNativeKMD(skipDebug) {
  const coin = 'KMD';

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getSyncInfoNativeKMD',
      'type': 'post',
      'url': `http://127.0.0.1:${Config.iguanaCorePort}/api/dex/getinfo?userpass=tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}&symbol=${coin}`,
      'payload': '',
      'status': 'pending',
    }));

    return fetch(`http://127.0.0.1:${Config.iguanaCorePort}/api/dex/getinfo?userpass=tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}&symbol=${coin}`, {
      method: 'GET',
    })
    .catch(function(error) {
      console.log(error);
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'error',
        'response': error,
      }));
      dispatch(
        triggerToaster(
          'getSyncInfoNativeKMD',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getSyncInfoNativeState({ 'remoteKMDNode': json }));
    })
    .then(function() {
      if (!skipDebug) {
        dispatch(getDebugLog('komodo', 1));
      }
    })
  }
}

function getSyncInfoNativeState(json, coin, skipDebug) {
  console.log('getSyncInfoNativeState', json);
  if (coin === 'KMD' &&
      json &&
      json.error) {
    return getSyncInfoNativeKMD(skipDebug);
  } else {
    if (json &&
        json.error &&
        Config.cli.default) {
      console.log('getSyncInfoNativeState', 'error');
      return {
        type: SYNCING_NATIVE_MODE,
        progress: Config.cli.default ? json.error : json,
      }
    } else {
      return {
        type: SYNCING_NATIVE_MODE,
        progress: Config.cli.default ? json.result : json,
      }
    }
  }
}

export function getSyncInfoNative(coin, skipDebug) {
  let payload = {
    'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    'agent': getPassthruAgent(coin),
    'method': 'passthru',
    'asset': coin,
    'function': 'getinfo',
    'hex': '',
  };

  if (Config.cli.default) {
    payload = {
      mode: null,
      chain: coin,
      cmd: 'getinfo'
    };
  }

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getSyncInfo',
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
          'getSyncInfo',
          'Error',
          'error'
        )
      );
    })
    .then(function(response) {
      const _response = response.text().then(function(text) { return text; });
      return _response;
    })
    //.then(response => response.json())
    .then(json => {
      if (!json &&
        Config.cli.default) {
        dispatch(
          triggerToaster(
            'Komodod is down',
            'Critical Error',
            'error',
            false
          )
        );
      } else {
        json = JSON.parse(json);
      }

      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(
        getSyncInfoNativeState(
          json,
          coin,
          skipDebug
        )
      );
    })
  }
}