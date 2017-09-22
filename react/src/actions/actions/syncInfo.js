// remove

import { SYNCING_FULL_MODE } from '../storeType';
import { triggerToaster } from '../actionCreators';
import Config from '../../config';

// TODO: add custom json parser
function getSyncInfoState(json) {
  try {
    JSON.parse(json);
    json = JSON.parse(json);
  } catch(e) {
    //
  }

  return {
    type: SYNCING_FULL_MODE,
    progress: json,
  }
}

export function getSyncInfo(coin) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    coin: coin,
    agent: 'bitcoinrpc',
    method: 'getinfo',
  };

  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
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
    .then(function(json) {
      if (json.indexOf('coin is busy processing') === -1) {
        dispatch(getSyncInfoState(json, dispatch));
      }
    })
  }
}