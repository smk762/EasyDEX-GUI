import {
  triggerToaster,
  getNewKMDAddresses
} from '../actionCreators';
import Config from '../../config';

function getNewAddress(coin) { // TODO: remove(?)
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: coin,
      cmd: 'getnewaddress',
    };

    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: payload }),
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      _fetchConfig
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'genJumblrAddress + getKMDAddressesNative',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json.result ? json.result : json);
    })
  });
}

export function setJumblrAddress(coin, type, address) {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: coin,
      cmd: type === 'deposit' ? 'jumblr_deposit' : 'jumblr_secret',
      params: [address],
    };

    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: payload }),
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      _fetchConfig
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'setJumblrAddress',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}

function dumpPrivkey(coin, key) {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: coin,
      cmd: 'dumpprivkey',
      params: [key],
    };

    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: payload }),
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      _fetchConfig
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'dumpPrivkey ',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json.result ? json.result : json);
    })
  });
}

export function importPrivkey(coin, key, rescan = false) {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: coin,
      cmd: 'importprivkey',
      params: [
        key,
        '',
        rescan
      ],
    };

    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: payload }),
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      _fetchConfig
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'importPrivkey ',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json.result ? json.result : json);
    })
  });
}