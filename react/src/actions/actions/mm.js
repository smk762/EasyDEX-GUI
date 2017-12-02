import {
  DEX_LOGIN,
  DEX_RESET,
  DEX_ASKS,
  DEX_BIDS,
  DEX_SWAPS,
  DEX_ADD_COIN,
  DEX_REMOVE_COIN,
  DEX_INVENTORY,
  DEX_UTXO,
  DEX_CACHE_PRELOAD,
  DEX_PRICES,
} from '../storeType';
import { translate } from '../../translate/translate';
import Config from '../../config';
import {
  triggerToaster,
} from '../actionCreators';
import Store from '../../store';

export function shepherdMMCachePreloadState(isAuth, asks, bids, pair, coins, swaps, rates) {
  return {
    type: DEX_CACHE_PRELOAD,
    isAuth,
    asks,
    bids,
    pair,
    coins,
    swaps,
    rates,
  }
}

export function shepherdMMResetState() {
  return {
    type: DEX_RESET,
  }
}

export function shepherdMMStart(passphrase) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/mm/start?passphrase=${passphrase}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdMMStart',
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

export function shepherdMMStop() {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/mm/stop`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdMMStop',
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

export function shepherdMMRequest(payload) {
  console.warn(payload);
  return dispatch => {
    return fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/mm/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload, }),
      },
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdMMRequest',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(shepherdMMRequstState(payload.mapToProp, json));
    });
  }
}

export function shepherdMMRequstState(prop, json) {
  if (prop === 'prices') {
    return {
      type: DEX_PRICES,
      prices: json,
    }
  } else if (prop === 'statsdisp') {
    return {
      type: DEX_STATS,
      prices: json,
    }
  }
}