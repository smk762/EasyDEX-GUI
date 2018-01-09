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
import Store from '../../store';

export function shepherdElectrumSetServer(coin, address, port) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/coins/server/set?address=${address}&port=${port}&coin=${coin}&token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumSetServer',
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

export function shepherdElectrumCheckServerConnection(address, port) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/servers/test?address=${address}&port=${port}&token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumCheckServerConnection',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export function shepherdElectrumKeys(seed) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seed,
        active: true,
        iguana: true,
        token: Config.token,
      }),
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumKeys',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export function shepherdElectrumBalance(coin, address) {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/getbalance?coin=${coin}&address=${address}&token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdElectrumBalance',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
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
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/listtransactions?coin=${coin}&address=${address}&full=true&maxlength=20&token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdElectrumTransactions',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(shepherdElectrumTransactionsState(json));
    });
  }
}

export function shepherdElectrumTransactionsState(json) {
  json = json.result;

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
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/coins?token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdElectrumCoins',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
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
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/createrawtx?coin=${coin}&address=${sendToAddress}&value=${value}&change=${changeAddress}&gui=true&push=true&verify=true&token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdElectrumSend',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(sendToAddressState(json.msg === 'error' ? json : json.result));
    });
  }
}

export function shepherdElectrumSendPromise(coin, value, sendToAddress, changeAddress) {
  return new Promise((resolve, reject) => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/createrawtx?coin=${coin}&address=${sendToAddress}&value=${value}&change=${changeAddress}&gui=true&push=true&verify=true&token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumSendPromise',
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

export function shepherdElectrumSendPreflight(coin, value, sendToAddress, changeAddress) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/createrawtx?coin=${coin}&address=${sendToAddress}&value=${value}&change=${changeAddress}&gui=true&push=false&verify=true&token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumSendPreflight',
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

export function shepherdElectrumListunspent(coin, address) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/listunspent?coin=${coin}&address=${address}&full=true&token=${Config.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumListunspent',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export function shepherdElectrumBip39Keys(seed, match, addressdepth, accounts) {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/electrum/seed/bip39/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seed,
        match,
        addressdepth,
        accounts,
        token: Config.token,
      }),
    })
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumSetServer',
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