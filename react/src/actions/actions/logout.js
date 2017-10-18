// TODO: use in dex

import {
  LOGIN,
  LOGOUT
} from '../storeType';
import { triggerToaster } from '../actionCreators';
import Config from '../../config';

function logoutState(json) {
  sessionStorage.removeItem('IguanaActiveAccount');

  return {
    type: LOGIN,
    isLoggedIn: false,
  }
}

function logoutResetAppState() {
  return {
    type: LOGOUT,
  }
}

export function logout() {
  return dispatch => {
    dispatch(walletLock());
  }
}

function walletLock() {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    agent: 'bitcoinrpc',
    method: 'walletlock',
  };

  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'walletLock',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logoutState(json));
      dispatch(logoutResetAppState());
    })
  }
}