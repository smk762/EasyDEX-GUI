import { triggerToaster } from '../actionCreators';
import Config from '../../config';

export function shepherdStopCoind(coin) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/coind/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: coin === 'KMD' ? '' : JSON.stringify({ chain: coin }),
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdStopCoind',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}

export function shepherdRemoveCoin(coin) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/coins/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: coin === 'KMD' ? '' : JSON.stringify({ chain: coin }),
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdRemoveCoin',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}

export function shepherdGetCoinList() {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/coinslist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdGetCoinList',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}

export function shepherdPostCoinList(data) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/coinslist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'payload': data }),
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdPostCoinList',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}