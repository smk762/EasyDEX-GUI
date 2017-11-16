import {
  LOAD_APP_INFO,
  GET_WIF_KEY,
  GET_DEBUG_LOG,
  GET_PEERS_LIST,
  LOAD_APP_CONFIG
} from '../storeType';
import { translate } from '../../translate/translate';
import { triggerToaster } from '../actionCreators';
import Config from '../../config';

function getAppInfoState(json) {
  return {
    type: LOAD_APP_INFO,
    info: json,
  }
}

export function getAppInfo() {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/appinfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'getAppInfo',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => dispatch(getAppInfoState(json)))
  }
}

export function settingsWifkeyState(json, coin) {
  return {
    type: GET_WIF_KEY,
    wifkey: json,
    address: json[coin],
  }
}

function parseImportPrivKeyResponse(json, dispatch) {
  if (json.error === 'illegal privkey') {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('API.ILLEGAL_PRIVKEY'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'error'
        )
      );
    }
  } else if (json.error === 'privkey already in wallet') {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('API.PRIVKEY_IN_WALLET'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'warning'
        )
      );
    }
  }

  if (json &&
      json.result !== undefined &&
      json.result == 'success') {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('TOASTR.PRIV_KEY_IMPORTED'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'success'
        )
      );
    }
  }
}

export function importPrivKey(wifKey) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    method: 'importprivkey',
    params: [
      wifKey,
      'imported'
    ],
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
          'importPrivKey',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(
        parseImportPrivKeyResponse(
          json,
          dispatch
        )
      );
    })
    .catch((ex) => {
      dispatch(parseImportPrivKeyResponse({
        error: 'privkey already in wallet',
      }, dispatch));
      console.log('parsing failed', ex);
    })
  }
}

function getDebugLogState(json) {
  const _data = json.result.replace('\n', '\r\n');

  return {
    type: GET_DEBUG_LOG,
    data: _data,
  }
}

export function getDebugLog(target, linesCount, acName) {
  const payload = {
    herdname: target,
    lastLines: linesCount,
  };

  if (acName) {
    payload.ac = acName;
  }

  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/debuglog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'getDebugLog',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => dispatch(getDebugLogState(json)))
  }
}

export function getPeersList(coin) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    agent: 'SuperNET',
    method: 'getpeers',
    activecoin: coin,
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
          'getPeersList',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(getPeersListState(json, dispatch));
    })
  }
}

export function getPeersListState(json) {
  let peersList = {};

  if (json &&
      json.rawpeers &&
      json.rawpeers.length) {
    for (let i = 0; i < json.rawpeers.length; i++) {
      peersList[json.rawpeers[i].coin] = json.rawpeers[i].peers;
    }
  }

  return {
    type: GET_PEERS_LIST,
    supernetPeers: json && json.supernet[0] ? json.supernet : null,
    rawPeers: peersList,
  }
}

function addPeerNodeState(json, dispatch) {
  if (json.error === 'addnode needs active coin, do an addcoin first') {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('API.ADDNODE_NEEDS_COIN'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'error'
        )
      );
    }
  } else if (json.result === 'peer was already connected') {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('API.PEER_ALREADY_CONN'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'warning'
        )
      );
    }
  } else if (json.result === 'addnode connection was already pending') {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('API.ADDNODE_ALREADY_PENDING'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'warning'
        )
      );
    }
  } else if (json.result === 'addnode submitted') {
    return dispatch => {
      dispatch(
        triggerToaster(
          translate('API.PEER_ADDED'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'success'
        )
      );
    }
  }
}

export function addPeerNode(coin, ip) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    agent: 'iguana',
    method: 'addnode',
    activecoin: coin,
    ipaddr: ip,
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
          'addPeerNode',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(addPeerNodeState(json, dispatch));
    })
  }
}

export function saveAppConfig(_payload) {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/appconf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: _payload }),
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'saveAppConfig',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(getAppConfig());
      dispatch(
        triggerToaster(
          translate('TOASTR.SETTINGS_SAVED'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'success'
        )
      );
    })
  }
}

function getAppConfigState(json) {
  return {
    type: LOAD_APP_CONFIG,
    config: json,
  }
}

export function getAppConfig() {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/appconf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'getAppConfig',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => dispatch(getAppConfigState(json)))
  }
}

export function resetAppConfig() {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/appconf/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'resetAppConfig',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(getAppConfig());
      dispatch(
        triggerToaster(
          translate('TOASTR.SETTINGS_RESET'),
          translate('TOASTR.SETTINGS_NOTIFICATION'),
          'success'
        )
      );
    })
  }
}

export function coindGetStdout(chain) {
  const _chain = chain === 'KMD' ? 'komodod' : chain;

  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/coind/stdout?chain=${chain}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'coindGetStdout',
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

export function getWalletDatKeys(chain, keyMatchPattern) {
  const _chain = chain === 'KMD' ? null : chain;

  return new Promise((resolve, reject) => {
    fetch(keyMatchPattern ? `http://127.0.0.1:${Config.agamaPort}/shepherd/coindwalletkeys?chain=${_chain}&search=${keyMatchPattern}` : `http://127.0.0.1:${Config.agamaPort}/shepherd/coindwalletkeys?chain=${_chain}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'getWalletDatKeys',
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