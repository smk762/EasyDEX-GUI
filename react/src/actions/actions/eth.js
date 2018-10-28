import {
  DASHBOARD_ETHEREUM_BALANCE,
  DASHBOARD_ETHEREUM_TRANSACTIONS,
  DASHBOARD_ETHEREUM_COINS,
} from '../storeType';
import translate from '../../translate/translate';
import Config, {
  token,
  agamaPort,
} from '../../config';
import {
  triggerToaster,
  sendToAddressState,
  activeHandle,
} from '../actionCreators';
import Store from '../../store';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';
import mainWindow from '../../util/mainWindow';

export const apiEthereumAuth = (seed) => {
  return dispatch => {
    return fetch(
      `http://127.0.0.1:${agamaPort}/api/eth/auth`,
      fetchType(
        JSON.stringify({
          seed,
          iguana: true,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.apiEthereumAuth') + ' (code: apiEthereumAuth)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      if (json.msg !== 'error') {
        dispatch(activeHandle());
        dispatch(apiEthereumCoins());
      } else {
        dispatch(
          triggerToaster(
            translate('TOASTR.INCORRECT_ETH_PRIV'),
            translate('TOASTR.ERROR'),
            'error'
          )
        );
      }
    });
  }
}

export const apiEthereumCoins = () => {
  return dispatch => {
    const _urlParams = {
      token,
    };
    return fetch(
      `http://127.0.0.1:${agamaPort}/api/eth/coins${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.apiEthereumCoins') + ' (code: apiEthereumCoins)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(apiEthereumCoinsState(json));
    });
  }
}

export const apiEthereumCoinsState = (json) => {
  return {
    type: DASHBOARD_ETHEREUM_COINS,
    ethereumCoins: json.result,
  }
}

export const apiEthereumKeys = (seed) => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/api/eth/keys`,
      fetchType(
        JSON.stringify({
          seed,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.apiEthereumKeys') + ' (code: apiEthereumKeys)',
          translate('TOASTR.ERROR'),
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

export const apiEthereumBalance = (coin, address) => {
  const network = coin.toLowerCase().indexOf('eth_') > -1 ? coin.split('_') : null;
  
  return dispatch => {
    let _urlParams = {
      token,
      address,
      coin,
    };

    if (network) {
      _urlParams.network = network[1].toLowerCase();
    }
    
    return fetch(
      `http://127.0.0.1:${agamaPort}/api/eth/balance${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.apiEthereumBalance') + ' (code: apiEthereumBalance)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      if (mainWindow.activeCoin === coin) {
        dispatch(apiEthereumBalanceState(json));
      }
    });
  }
}

export const apiEthereumBalanceState = (json) => {
  return {
    type: DASHBOARD_ETHEREUM_BALANCE,
    balance: json.result,
  }
}

export const apiEthereumTransactions = (coin, address) => {
  const network = coin.toLowerCase().indexOf('eth_') > -1 ? coin.split('_') : null;
  
  return dispatch => {
    let _urlParams = {
      token,
      address,
      coin,
    };

    if (network) {
      _urlParams.network = network[1].toLowerCase();
    }

    return fetch(
      `http://127.0.0.1:${agamaPort}/api/eth/transactions${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.apiEthereumTransactions') + ' (code: apiEthereumTransactions)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      if (mainWindow.activeCoin === coin) {
        dispatch(apiEthereumTransactionsState(json));
      }
    });
  }
}

export const apiEthereumTransactionsState = (json) => {
  if (json) {
    json = json.result;
  } else {
    json = {
      error: 'error',
    };
  }

  if (json &&
      json.error) {
    json = null;
  } else if (
    !json ||
    !json.length
  ) {
    json = 'no data';
  }

  return {
    type: DASHBOARD_ETHEREUM_TRANSACTIONS,
    txhistory: json,
  }
}

export const apiEthereumGasPrice = () => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/api/eth/gasprice/${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.apiEthereumGasPrice') + ' (code: apiEthereumGasPrice)',
          translate('TOASTR.ERROR'),
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

/*export const apiEthereumSend = (coin, value, sendToAddress, changeAddress, btcFee, customFee, isKv, opreturn) => {
  value = Math.floor(value);

  return dispatch => {
    const payload = {
      token,
      coin,
      value,
      customFee,
      address: changeAddress,
      change: changeAddress,
      opreturn,
      gui: true,
      verify: true,
      push: true,
    };
    const _urlParams = {
      token,
      coin,
      value,
      customFee,
      address: sendToAddress,
      change: changeAddress,
      gui: true,
      verify: true,
      push: true,
    };

    return fetch(
      isKv ? `http://127.0.0.1:${agamaPort}/api/eth/createrawtx` : `http://127.0.0.1:${agamaPort}/api/eth/createrawtx${urlParams(_urlParams)}${btcFee ? '&btcfee=' + btcFee : ''}`,
      isKv ? fetchType(JSON.stringify(payload)).post : fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.apiEthereumSend') + ' (code: apiEthereumSend)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(sendToAddressState(json.msg === 'error' ? json : json.result));
    });
  }
}*/

export const apiEthereumPushTx = (coin, rawtx) => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/api/eth/pushtx`,
      fetchType(
        JSON.stringify({
          network: coin,
          rawtx,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.apiEthereumPushTx') + ' (code: apiEthereumPushTx)',
          translate('TOASTR.ERROR'),
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