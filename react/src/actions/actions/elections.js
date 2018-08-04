import translate from '../../translate/translate';
import Config, {
  token,
  agamaPort,
} from '../../config';
import { triggerToaster } from '../actionCreators';
import Store from '../../store';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';

export const shepherdElectionsBalance = (coin, address) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      coin,
      address,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/electrum/getbalance${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.shepherdElectionsBalance') + ' (code: shepherdElectionsBalance)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export const shepherdElectionsTransactions = (coin, address, type) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      coin,
      address,
      full: true,
      type,
      maxlength: 20,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/elections/listtransactions${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.shepherdElectionsTransactions') + ' (code: shepherdElectionsTransactions)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export const shepherdElectionsStatus = () => {
  return new Promise((resolve, reject) => {
    return fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/elections/status`,
      fetchType(
        JSON.stringify({
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdElectionsStatus') + ' (code: shepherdElectionsStatus)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}

export const shepherdElectionsLogin = (seed, network) => {
  return new Promise((resolve, reject) => {
    return fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/elections/login`,
      fetchType(
        JSON.stringify({
          seed,
          network,
          iguana: true,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdElectionsLogin') + ' (code: shepherdElectionsLogin)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}

export const shepherdElectionsLogout = () => {
  return new Promise((resolve, reject) => {
    return fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/elections/logout`,
      fetchType(
        JSON.stringify({
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdElectionsLogout') + ' (code: shepherdElectionsLogout)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}

export const shepherdElectionsSend = (coin, value, sendToAddress, changeAddress, opreturn) => {
  value = Math.floor(value);

  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      coin,
      address,
      value,
      opreturn,
      change: changeAddress,
      vote: true,
      push: true,
      verify: false
    };
    return fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/electrum/createrawtx${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdElectionsSend') + ' (code: shepherdElectionsSend)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}

export const shepherdElectionsSendMany = (coin, targets, change, opreturn) => {
  return new Promise((resolve, reject) => {
    return fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/electrum/createrawtx-multiout`,
      fetchType(
        JSON.stringify({
          token,
          coin,
          targets,
          change,
          opreturn,
          push: true,
          verify: false,
          vote: true,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdElectionsSendMany') + ' (code: shepherdElectionsSendMany)',
          translate('TOASTR.ERROR'),
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}