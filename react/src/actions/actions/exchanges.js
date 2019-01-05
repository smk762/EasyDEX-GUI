import { triggerToaster } from '../actionCreators';
import { EXCHANGES_CACHE } from '../storeType';
import Config, {
  token,
  agamaPort,
} from '../../config';
import Store from '../../store';
import fetchType from '../../util/fetchType';
import translate from '../../translate/translate';
import urlParams from '../../util/url';

export const getExchangesCache = (provider) => {
  return dispatch => {
    const _urlParams = {
      token,
      provider,
    };
    return fetch(
      `http://127.0.0.1:${agamaPort}/api/exchanges/cache${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getExchangesCache') + ' (code: getExchangesCache)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(exchangesState(json && json.result ? json.result : json, provider));
    });
  };
}

const exchangesState = (json, provider) => {
  return {
    type: EXCHANGES_CACHE,
    cache: json,
    provider: provider,
  }
};

export const exchangesGetCoins = (provider) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/api/exchanges/${provider}/coins${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.exchangesGetCoins'),
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json && json.result ? json.result : json));
  });
}

export const exchangesGetRate = (provider, src, dest) => {
  return new Promise((resolve, reject) => {
    resolve({"msg":"success","result":{"success":true,"code":"OK","data":{"rate":8.64656004,"minerFee":0,"limitMinDepositCoin":24.775061,"limitMaxDepositCoin":4408.575,"limitMinDestinationCoin":214.219054,"limitMaxDestinationCoin":38119.013},"msg":""}});
    /*const _urlParams = {
      token,
      combined: true, // changelly
      src,
      dest,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/api/exchanges/${provider}/rate${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.exchangesGetRate'),
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json && json.result ? json.result : json));*/
  });
}