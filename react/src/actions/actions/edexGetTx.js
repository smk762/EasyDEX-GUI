import { triggerToaster } from '../actionCreators';
import Config from '../../config';

export function edexGetTransaction(data, dispatch) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    symbol: data.coin,
    agent: 'dex',
    method: 'gettransaction',
    vout: 1,
    txid: data.txid
  };

  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
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
      resolve(json);
    })
  });
}
