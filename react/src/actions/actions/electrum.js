import {
  DASHBOARD_ELECTRUM_BALANCE,
  DASHBOARD_ELECTRUM_TRANSACTIONS,
  DASHBOARD_ELECTRUM_COINS,
} from '../storeType';
import { translate } from '../../translate/translate';
import Config from '../../config';
import {
  triggerToaster,
  sendToAddressState,
} from '../actionCreators';

export function shepherdElectrumBalance(coin, address) {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/getbalance?coin=${coin}&address=${address}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdElectrumBalance',
          'Error',
          'error'
        )
      )
    })
    .then(response => response.json())
    .then(json => {
      console.warn(json);
      dispatch(shepherdElectrumBalanceState(json));
    });
  }
}

export function shepherdElectrumBalanceState(json) {
  return {
    type: DASHBOARD_ELECTRUM_BALANCE,
    balance: json.result,
  }
}

export function shepherdElectrumTransactions(coin, address) {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/listtransactions?coin=${coin}&address=${address}&full=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdElectrumTransactions',
          'Error',
          'error'
        )
      )
    })
    .then(response => response.json())
    .then(json => {
      console.warn(json);
      dispatch(shepherdElectrumTransactionsState(json));
    });
  }
}

export function shepherdElectrumTransactionsState(json) {
  json = json.result.listtransactions;

  if (json &&
      json.error) {
    json = null;
  } else if (!json || !json.length) {
    json = 'no data';
  }

  return {
    type: DASHBOARD_ELECTRUM_TRANSACTIONS,
    txhistory: json,
  }
}

export function shepherdElectrumCoins() {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/coins`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdElectrumCoins',
          'Error',
          'error'
        )
      )
    })
    .then(response => response.json())
    .then(json => {
      console.warn(json);
      dispatch(shepherdElectrumCoinsState(json));
    });
  }
}

export function shepherdElectrumCoinsState(json) {
  return {
    type: DASHBOARD_ELECTRUM_COINS,
    electrumCoins: json.result,
  }
}

// value in sats
export function shepherdElectrumSend(coin, value, sendToAddress, changeAddress) {
  // console.log(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/createrawtx?coin=${coin}&address=${sendToAddress}&value=${value}&change=${changeAddress}&gui=true`);

  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/createrawtx?coin=${coin}&address=${sendToAddress}&value=${value}&change=${changeAddress}&gui=true&push=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdElectrumSend',
          'Error',
          'error'
        )
      )
    })
    .then(response => response.json())
    .then(json => {
      console.warn(json);
      dispatch(sendToAddressState(json.result));
    });
  }
}
