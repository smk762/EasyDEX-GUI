import { triggerToaster } from '../actionCreators';
import { CLI } from '../storeType';
import Config, {
  token,
  agamaPort,
} from '../../config';
import Store from '../../store';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';
import translate from '../../translate/translate';

export const shepherdCliPromise = (mode, chain, cmd, params) => {
  let payload = {
    mode,
    chain,
    cmd,
    token,
  };

  if (params) {
    payload.params = params;
  }

  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/cli`,
      fetchType(JSON.stringify({ payload })).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdCli') + ' (code: shepherdCli)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json));
  });
}

export const shepherdCli = (mode, chain, cmd) => {
  const payload = {
    mode,
    chain,
    cmd,
    token,
  };

  return dispatch => {
    return fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/cli`,
      fetchType(JSON.stringify({ payload })).post
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.shepherdCli') + ' (code: shepherdCli)',
          translate('TOASTR.ERROR'),
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => dispatch(cliResponseState(json)));
  }
}

export const cliResponseState = (json) => {
  return {
    type: CLI,
    data: json,
  }
}