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
      'url': Config.iguanaLessMode ? 'http://kmd.explorer.supernet.org/api/status?q=getInfo' : `http://127.0.0.1:${Config.iguanaCorePort}/api/dex/getinfo?userpass=tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}&symbol=${coin}`,
      'payload': '',
      'status': 'pending',
    }));

    return fetch(
      Config.iguanaLessMode ? 'http://kmd.explorer.supernet.org/api/status?q=getInfo' : `http://127.0.0.1:${Config.iguanaCorePort}/api/dex/getinfo?userpass=tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}&symbol=${coin}`, {
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
        'response': Config.iguanaLessMode ? json.info : json,
      }));
      dispatch(getSyncInfoNativeState({ 'remoteKMDNode': Config.iguanaLessMode ? json.info : json }));
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
      json.error &&
      json.error.message.indexOf('Activating best') === -1) {
    return getSyncInfoNativeKMD(skipDebug);
  } else {
    if (json &&
        json.error &&
        Config.cli.default) {
      return {
        type: SYNCING_NATIVE_MODE,
        progress: json.error,
      }
    } else {
      return {
        type: SYNCING_NATIVE_MODE,
        progress: json.result ? json.result : json,
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

      if (json.error &&
          json.error.message.indexOf('Activating best') === -1) {
        dispatch(getDebugLog('komodo', 1));
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