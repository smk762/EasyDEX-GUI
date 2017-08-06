import { triggerToaster } from '../actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';
import Config from '../../config';

export function edexGetTransaction(data, dispatch) {
  const payload = {
    'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    'symbol': data.coin,
    'agent': 'dex',
    'method': 'gettransaction',
    'vout': 1,
    'txid': data.txid
  };

  return new Promise((resolve, reject) => {
    const _timestamp = Date.now();
    if (Config.debug) {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'function': 'edexGetTransaction',
        'type': 'post',
        'url': `http://127.0.0.1:${Config.iguanaCorePort}`,
        'payload': payload,
        'status': 'pending',
      }));
    }

    fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
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
          'edexGetTransaction',
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
      resolve(json);
    })
  });
}
