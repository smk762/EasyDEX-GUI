import {
  LOGIN,
  LOGOUT
} from '../storeType';
import { triggerToaster } from '../actionCreators';
import Config from '../../config';
import {
  logGuiHttp,
  guiLogState
} from './log';

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
    'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    'agent': 'bitcoinrpc',
    'method': 'walletlock',
  };

  return dispatch => {
    const _timestamp = Date.now();
    if (Config.debug) {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'function': 'walletLock',
        'type': 'post',
        'url': `http://127.0.0.1:${Config.iguanaCorePort}`,
        'payload': payload,
        'status': 'pending',
      }));
    }

    return fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      if (Config.debug) {
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'status': 'error',
          'response': error,
        }));
      }
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
      if (Config.debug) {
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'status': 'success',
          'response': json,
        }));
      }
      dispatch(logoutState(json));
      dispatch(logoutResetAppState());
    })
  }
}