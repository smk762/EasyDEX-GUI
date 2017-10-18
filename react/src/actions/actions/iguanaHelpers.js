// remove

import Config from '../../config';
import { checkAC } from '../../components/addcoin/payload';

export function getPassthruAgent(coin) {
  let passthruAgent;

  if (coin === 'KMD') { passthruAgent = 'komodo'; };
  if (coin === 'ZEC') { passthruAgent = 'zcash'; };

  if (checkAC(coin)) { passthruAgent = 'iguana'; };

  return passthruAgent;
}

export function iguanaHashHex(data, dispatch) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    agent: 'hash',
    method: 'hex',
    message: data,
  };

  return new Promise((resolve, reject) => {
    // skip iguana hashing in cli mode
    if (Config.cli.default) {
      resolve(true);
    } else {
      fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          triggerToaster(
            'iguanaHashHex',
            'Error',
            'error'
          )
        );
      })
      .then(response => response.json())
      .then(json => {
        resolve(json.hex);
      })
    }
  })
}

