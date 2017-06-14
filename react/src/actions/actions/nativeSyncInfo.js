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
      dispatch(triggerToaster('getSyncInfoNativeKMD', 'Error', 'error'));
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
  if (coin === 'KMD' &&
      json &&
      json.error) {
    return getSyncInfoNativeKMD(skipDebug);
  } else {
    return {
      type: SYNCING_NATIVE_MODE,
      progress: Config.cli.default === true ? json.result : json,
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

  if (Config.cli.default === true) {
    payload = {
      mode: null,
      coin,
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

    if (Config.cli.default === true) {
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
      dispatch(triggerToaster('getSyncInfo', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getSyncInfoNativeState(json, coin, skipDebug));
    })
  }
}