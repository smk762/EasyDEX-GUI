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
          translate('API.getExchangesCache'),
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

/*export const exchangesGetOrder = (provider) => {
  return dispatch => {
    const _urlParams = {
      token,
      provider,
    };
    return fetch(
      `http://127.0.0.1:${agamaPort}/api/exchanges/order${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getExchangesCache'),
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
}*/