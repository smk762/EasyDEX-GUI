import {
  triggerToaster,
  dashboardCoinsState,
} from '../actionCreators';
import Config, {
  token,
  agamaPort,
} from '../../config';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';

// TODO: find out why it errors on slow systems
export const getDexCoins = () => {
  return dispatch => {
    const _urlParams = {
      token,
    };
    return fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/InstantDEX/allcoins${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'getDexCoins',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(dashboardCoinsState(json));
    });
  }
}