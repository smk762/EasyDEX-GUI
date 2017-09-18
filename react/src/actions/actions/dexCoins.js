import {
  triggerToaster,
  dashboardCoinsState
} from '../actionCreators';
import Config from '../../config';

// TODO: find out why it errors on slow systems
export function getDexCoins() {
  const _payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    agent: 'InstantDEX',
    method: 'allcoins',
  };

  return dispatch => {
    let _fetchConfig = {
      method: 'POST',
      body: JSON.stringify(_payload),
    };

    if (Config.iguanaLessMode) {
      _fetchConfig = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    return fetch(
      Config.iguanaLessMode ? `http://127.0.0.1:${Config.agamaPort}/shepherd/InstantDEX/allcoins` : `http://127.0.0.1:${Config.iguanaCorePort}`,
      _fetchConfig
    )
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'Error getDexCoins',
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