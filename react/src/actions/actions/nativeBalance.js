import { DASHBOARD_ACTIVE_COIN_NATIVE_BALANCE } from '../storeType';
import { triggerToaster } from '../actionCreators';
import Config from '../../config';

export function getKMDBalanceTotal(coin) {
  return dispatch => {
    const payload = {
      mode: null,
      chain: coin,
      cmd: 'z_gettotalbalance',
    };
    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: payload }),
    };

    return fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      _fetchConfig
    )
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'getKMDBalanceTotal',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(function(json) { // TODO: figure out why komodod spits out "parse error"
      if (json &&
          !json.error) {
        dispatch(getNativeBalancesState(json));
      }
    })
  }
}

export function getNativeBalancesState(json) {
  return {
    type: DASHBOARD_ACTIVE_COIN_NATIVE_BALANCE,
    balance: json && !json.error ? json.result : 0,
  }
}