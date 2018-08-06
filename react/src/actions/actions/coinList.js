import { triggerToaster } from '../actionCreators';
import Config, {
  token,
  agamaPort,
} from '../../config';
import Store from '../../store';
import translate from '../../translate/translate';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';

export const shepherdElectrumLock = () => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/electrum/lock`,
      fetchType(JSON.stringify({ token })).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdElectrumLock') + ' (code: shepherdElectrumLock)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json));
  });
}

export const shepherdElectrumLogout = () => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/electrum/logout`,
      fetchType(JSON.stringify({ token })).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdElectrumLogout') + ' (code: shepherdElectrumLogout)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json));
  });
}

export const shepherdStopCoind = (coin) => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/coind/stop`,
      fetchType(coin === 'KMD' ? JSON.stringify({ token }) : JSON.stringify({ chain: coin, token })).post
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.shepherdStopCoind') + ' (code: shepherdStopCoind)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json));
  });
}

export const shepherdRemoveCoin = (coin, mode) => {
  return new Promise((resolve, reject, dispatch) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/coins/remove`,
      fetchType(
        JSON.stringify(coin === 'KMD' && mode === 'native' ? {
          mode,
          token,
        } : {
          mode,
          chain: coin,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdRemoveCoin') + ' (code: shepherdRemoveCoin)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
      if (mode === 'native') {
        Store.dispatch(
          triggerToaster(
            `${coin} ${translate('API.DAEMON_IS_STILL_RUNNING')}`,
            translate('API.WARNING'),
            'warning'
          )
        );
      }
    });
  });
}

export const shepherdGetCoinList = () => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/coinslist${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdGetCoinList') + ' (code: shepherdGetCoinList)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json));
  });
}

export const shepherdPostCoinList = (data) => {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${agamaPort}/shepherd/coinslist`,
      fetchType(
        JSON.stringify({
          payload: data,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdPostCoinList') + ' (code: shepherdPostCoinList)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json));
  });
}

export const shepherdClearCoindFolder = (coin, keepWalletDat) => {
  return new Promise((resolve, reject) => {
    const _urlParams1 = {
      token,
      coin,
      keepwallet: true,
    };
    const _urlParams2 = {
      token,
      coin,
    };
    fetch(
      keepWalletDat ? `http://127.0.0.1:${agamaPort}/shepherd/kick${urlParams(_urlParams1)}` : `http://127.0.0.1:${Config.agamaPort}/shepherd/kick${urlParams(_urlParams2)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.shepherdClearCoindFolder') + ' (code: shepherdClearCoindFolder)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json));
  });
}