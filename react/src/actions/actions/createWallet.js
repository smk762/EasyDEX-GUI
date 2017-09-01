import { translate } from '../../translate/translate';
import { triggerToaster } from '../actionCreators';
import Config from '../../config';

function createNewWalletState(json) {
  if (json &&
      json.result &&
      json.result === 'success') {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('TOASTR.WALLET_CREATED_SUCCESFULLY'),
          translate('TOASTR.ACCOUNT_NOTIFICATION'),
          'success'
        )
      );
    }
  } else {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('API.COULDNT_CREATE_SEED'),
          translate('TOASTR.ACCOUNT_NOTIFICATION'),
          'error'
        )
      );
    }
  }
}

export function createNewWallet(_passphrase) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    agent: 'bitcoinrpc',
    method: 'encryptwallet',
    passphrase: _passphrase,
  };

  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'createNewWallet',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(createNewWalletState(json));
    })
  }
}