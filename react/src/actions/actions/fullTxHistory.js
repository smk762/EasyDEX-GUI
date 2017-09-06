import {
  triggerToaster,
  getNativeTxHistoryState
} from '../actionCreators';
import Config from '../../config';

export function getFullTransactionsList(coin) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    coin: coin,
    method: 'listtransactions',
    params: [
      0,
      9999999,
      []
    ],
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
          'getFullTransactionsList',
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