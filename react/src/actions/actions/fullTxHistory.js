import {
  triggerToaster,
  getNativeTxHistoryState
} from '../actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';
import Config from '../../config';

export function getFullTransactionsList(coin) {
  const payload = {
    'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    'coin': coin,
    'method': 'listtransactions',
    'params': [
      0,
      9999999,
      []
    ],
  };

  return dispatch => {
    const _timestamp = Date.now();
    if (Config.debug) {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'function': 'getFullTransactionsList',
        'type': 'post',
        'url': `http://127.0.0.1:${Config.iguanaCorePort}`,
        'payload': payload,
        'status': 'pending',
      }));
    }

    return fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      if (Config.debug) {
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'status': 'error',
          'response': error,
        }));
      }
      dispatch(
        triggerToaster(
          'getFullTransactionsList',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      if (Config.debug) {
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'status': 'success',
          'response': json,
        }));
      }
      dispatch(getNativeTxHistoryState(json));
    })
  }
}