import { FIAT_RATES } from '../storeType';
import { triggerToaster } from '../actionCreators';
import Config from '../../config';

export function fiatRates() {
  return dispatch => {
    return fetch(`http://46.20.235.46:8111/api/rates/kmd`, {
      method: 'GET',
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'fiatRates',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(fiatRates(json));
    });
  }
}

function fiatRates(json) {
  return {
    type: FIAT_RATES,
    response: json,
  }
}