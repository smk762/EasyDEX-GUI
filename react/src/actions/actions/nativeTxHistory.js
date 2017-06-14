import {
  triggerToaster,
  Config,
  getPassthruAgent,
  getNativeTxHistoryState
} from '../actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function getNativeTxHistory(coin) {
  let payload;

  if (getPassthruAgent(coin) === 'iguana') {
    payload = {
      'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
      'agent': 'iguana',
      'method': 'passthru',
      'asset': coin,
      'function': 'listtransactions',
      'hex': '',
    };
  } else {
    payload = {
      'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
      'agent': getPassthruAgent(coin),
      'method': 'passthru',
      'function': 'listtransactions',
      'hex': '',
    };
  }

  if (Config.cli.default === true) {
    payload = {
      mode: null,
      coin,
      cmd: 'listtransactions'
    };
  }

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getNativeTxHistory',
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
      dispatch(triggerToaster('getNativeTxHistory', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getNativeTxHistoryState(json));
    })
  }
}