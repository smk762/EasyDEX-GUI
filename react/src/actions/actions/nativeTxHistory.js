// remove

import {
  triggerToaster,
  getPassthruAgent,
  getNativeTxHistoryState
} from '../actionCreators';
import Config from '../../config';

export function getNativeTxHistory(coin) {
  let payload;

  if (getPassthruAgent(coin) === 'iguana') {
    payload = {
      userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
      agent: 'iguana',
      method: 'passthru',
      asset: coin,
      function: 'listtransactions',
      hex: '',
    };
  } else {
    payload = {
      userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
      agent: getPassthruAgent(coin),
      method: 'passthru',
      function: 'listtransactions',
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
        cmd: 'listtransactions',
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
          'getNativeTxHistory',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(getNativeTxHistoryState(json));
    })
  }
}