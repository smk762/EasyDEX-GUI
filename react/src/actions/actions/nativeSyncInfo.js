import { SYNCING_NATIVE_MODE } from '../storeType';
import {
  triggerToaster,
  getPassthruAgent,
  getDebugLog,
  toggleCoindDownModal
} from '../actionCreators';
import Config from '../../config';

// TODO: use debug.log instead
export function getSyncInfoNativeKMD(skipDebug, json) {
  const coin = 'KMD';
  // https://www.kmd.host/
  return dispatch => {
    return fetch(
      Config.iguanaLessMode ? 'https://kmd.explorer.supernet.org/api/status?q=getInfo' : `http://127.0.0.1:${Config.iguanaCorePort}/api/dex/getinfo?userpass=tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}&symbol=${coin}`, {
      method: 'GET',
    })
    .catch(function(error) {
      console.log(error);
      /*dispatch(
        triggerToaster(
          'getSyncInfoNativeKMD',
          'Error',
          'error'
        )
      );*/
      console.warn('remote kmd node fetch failed', true);
      dispatch(getSyncInfoNativeState({ remoteKMDNode: null }));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(getSyncInfoNativeState({ remoteKMDNode: Config.iguanaLessMode ? json.info : json }));
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
    return getSyncInfoNativeKMD(skipDebug, json);
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
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    agent: getPassthruAgent(coin),
    method: 'passthru',
    asset: coin,
    function: 'getinfo',
    hex: '',
  };

  if (Config.cli.default) {
    payload = {
      mode: null,
      chain: coin,
      cmd: 'getinfo',
    };
  }

  return dispatch => {
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
      if (json === 'Work queue depth exceeded') {
        dispatch(
          getSyncInfoNativeState(
            {
              result: 'daemon is busy',
              error: null,
              id: null
            },
            coin,
            skipDebug
          )
        );
      } else {
        if (!json &&
          Config.cli.default) {
          dispatch(
            triggerToaster(
              'Komodod is down',
              'Critical Error',
              'error',
              true
            )
          );

          if (coin === 'KMD') {
            dispatch(getDebugLog('komodo', 50));
          } else {
            dispatch(getDebugLog('komodo', 50, coin));
          }
          dispatch(toggleCoindDownModal(true));
        } else {
          json = JSON.parse(json);
        }

        if (json.error &&
            json.error.message.indexOf('Activating best') === -1) {
          if (coin === 'KMD') {
            dispatch(getDebugLog('komodo', 1));
          } else {
            dispatch(getDebugLog('komodo', 1, coin));
          }
        }

        dispatch(
          getSyncInfoNativeState(
            json,
            coin,
            skipDebug
          )
        );
      }
    })
  }
}