import {
  triggerToaster,
  dashboardCoinsState
} from '../actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';
import Config from '../../config';

// TODO: find out why it errors on slow systems
export function getDexCoins() {
  const _payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    agent: 'InstantDEX',
    method: 'allcoins',
  };

  return dispatch => {
    const _timestamp = Date.now();
    if (Config.debug) {
      dispatch(logGuiHttp({
        timestamp: _timestamp,
        function: 'getDexCoins',
        type: 'post',
        url: Config.iguanaLessMode ? `http://127.0.0.1:${Config.agamaPort}/shepherd/InstantDEX/allcoins` : `http://127.0.0.1:${Config.iguanaCorePort}`,
        payload: _payload,
        status: 'pending',
      }));
    }

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
      if (Config.debug) {
        dispatch(logGuiHttp({
          timestamp: _timestamp,
          status: 'error',
          response: error,
        }));
      }
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
      if (Config.debug) {
        dispatch(logGuiHttp({
          timestamp: _timestamp,
          status: 'success',
          response: json,
        }));
      }
      dispatch(dashboardCoinsState(json));
    });
  }
}