import { translate } from '../../translate/translate';
import Config from '../../config';
import {
  triggerToaster,
  toggleAddcoinModal,
  getDexCoins,
} from '../actionCreators';
import {
  startCurrencyAssetChain,
  startAssetChain,
  startCrypto,
  checkCoinType,
  checkAC
} from '../../components/addcoin/payload';

export function addCoin(coin, mode, syncOnly, port, startupParams) {
  return dispatch => {
    dispatch(shepherdGetConfig(coin, '-1', startupParams));
  }
}

function handleErrors(response) {
  let _parsedResponse;

  if (!response.ok) {
    return null;
  } else {
    _parsedResponse = response.text().then(function(text) { return text; });
    return _parsedResponse;
  }
}

export function shepherdHerd(coin, mode, path, startupParams) {
  let acData;
  let herdData = {
    'ac_name': coin,
    'ac_options': [
      '-daemon=0',
      '-server',
      `-ac_name=${coin}`,
      '-addnode=78.47.196.146',
    ]
  };

  if (coin === 'ZEC') {
    herdData = {
      'ac_name': 'zcashd',
      'ac_options': [
        '-daemon=0',
        '-server=1',
      ]
    };
  }

  if (coin === 'KMD') {
    herdData = {
      'ac_name': 'komodod',
      'ac_options': [
        '-daemon=0',
        '-addnode=78.47.196.146',
      ]
    };
  }

  if (startupParams) {
    herdData['ac_custom_param'] = startupParams.type;

    if (startupParams.value) {
      herdData['ac_custom_param_value'] = startupParams.value;
    }
  }

  // TODO: switch statement
  if (checkCoinType(coin) === 'crypto') {
    acData = startCrypto(
      path.result,
      coin,
      mode
    );
  }

  if (checkCoinType(coin) === 'currency_ac') {
    acData = startCurrencyAssetChain(
      path.result,
      coin,
      mode
    );
  }

  if (checkCoinType(coin) === 'ac') {
    const supply = startAssetChain(
      path.result,
      coin,
      mode,
      true
    );
    acData = startAssetChain(
      path.result,
      coin,
      mode
    );
    herdData.ac_options.push(`-ac_supply=${supply}`);
  }

  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/herd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'herd': coin !== 'ZEC' ? 'komodod' : 'zcashd',
        'options': herdData,
      }),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('FAILED_SHEPHERD_HERD'),
          translate('TOASTR.SERVICE_NOTIFICATION'),
          'error'
        )
      );
    })
    .then(handleErrors)
    .then(function(json) {
      if (json) {
        dispatch(
          addCoinResult(coin, mode)
        );
      } else {
        console.warn(acData);
        dispatch(
          triggerToaster(
            `Error starting ${coin} daemon. Port ${acData.rpc} is already taken!`, // translate
            translate('TOASTR.SERVICE_NOTIFICATION'),
            'error',
            false
          )
        );
      }
    });
  }
}

export function addCoinResult(coin, mode) {
  const modeToValue = {
    '-1': 'native',
  };

  return dispatch => {
    dispatch(
      triggerToaster(
        `${coin} ${translate('TOASTR.STARTED_IN')} ${modeToValue[mode]} ${translate('TOASTR.MODE')}`,
        translate('TOASTR.COIN_NOTIFICATION'),
        'success'
      )
    );
    dispatch(toggleAddcoinModal(false, false));
    dispatch(getDexCoins());
  }
}

export function _shepherdGetConfig(coin, mode, startupParams) {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/getconf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chain: 'komodod' })
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          '_shepherdGetConfig',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(
      json => dispatch(
        shepherdHerd(
          coin,
          mode,
          json,
          startupParams
        )
      )
    );
  }
}

export function shepherdGetConfig(coin, mode, startupParams) {
  if (coin === 'KMD' &&
      mode === '-1') {
    return dispatch => {
      return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/getconf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chain: 'komodod' })
      })
      .catch(function(error) {
        console.log(error);
        dispatch(
          triggerToaster(
            'shepherdGetConfig',
            'Error',
            'error'
          )
        );
      })
      .then(response => response.json())
      .then(
        json => dispatch(
          shepherdHerd(
            coin,
            mode,
            json,
            startupParams
          )
        )
      )
    }
  } else {
    return dispatch => {
      return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/getconf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'chain': coin })
      })
      .catch(function(error) {
        console.log(error);
        dispatch(
          triggerToaster(
            'shepherdGetConfig',
            'Error',
            'error'
          )
        );
      })
      .then(response => response.json())
      .then(
        json => dispatch(
          shepherdHerd(
            coin,
            mode,
            json,
            startupParams
          )
        )
      );
    }
  }
}