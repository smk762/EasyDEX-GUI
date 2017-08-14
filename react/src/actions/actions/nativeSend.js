import { DASHBOARD_ACTIVE_COIN_NATIVE_OPIDS } from '../storeType';
import { translate } from '../../translate/translate';
import {
  triggerToaster,
  getPassthruAgent,
  iguanaHashHex
} from '../actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';
import Config from '../../config';

export function sendNativeTx(coin, _payload) {
  let ajaxDataToHex;
  let payload;
  let _apiMethod;

  // iguana core
  if ((_payload.addressType === 'public' && // transparent
      _payload.sendTo.length !== 95) || !_payload.sendFrom) {
    _apiMethod = 'sendtoaddress';
    ajaxDataToHex = `["${_payload.sendTo}", ${Number(_payload.amount) - Number(_payload.fee)}]`;
  } else { // private
    _apiMethod = 'z_sendmany';
    ajaxDataToHex = `["${_payload.sendFrom}", [{"address": "${_payload.sendTo}", "amount": ${Number(_payload.amount) - Number(_payload.fee)}}]]`;
  }

  return dispatch => {
    return iguanaHashHex(ajaxDataToHex, dispatch).then((hashHexJson) => {
      if (getPassthruAgent(coin) === 'iguana') {
        payload = {
          'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
          'agent': getPassthruAgent(coin),
          'method': 'passthru',
          'asset': coin,
          'function': _apiMethod,
          'hex': hashHexJson,
        };
      } else {
        payload = {
          'userpass': `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
          'agent': getPassthruAgent(coin),
          'method': 'passthru',
          'function': _apiMethod,
          'hex': hashHexJson,
        };
      }

      const _timestamp = Date.now();
      if (Config.debug) {
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'function': 'sendNativeTx',
          'type': 'post',
          'url': Config.cli.default ? `http://127.0.0.1:${Config.agamaPort}/shepherd/cli` : `http://127.0.0.1:${Config.iguanaCorePort}`,
          'payload': payload,
          'status': 'pending',
        }));
      }

      let _fetchConfig = {
        method: 'POST',
        body: JSON.stringify(payload),
      };

      if (Config.cli.default) { // rpc
        payload = {
          mode: null,
          chain: coin,
          cmd: payload.function,
          params:
            (_payload.addressType === 'public' && _payload.sendTo.length !== 95) || !_payload.sendFrom ?
            [
              _payload.sendTo,
              _payload.amount
            ]
            :
            [
              _payload.sendFrom,
              [{
                address: _payload.sendTo,
                amount: _payload.amount
              }]
            ]
        };

        _fetchConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 'payload': payload }),
        };
      }

      fetch(
        Config.cli.default ? `http://127.0.0.1:${Config.agamaPort}/shepherd/cli` : `http://127.0.0.1:${Config.iguanaCorePort}`,
        _fetchConfig
      )
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
            'sendNativeTx',
            'Error',
            'error'
          )
        );
      })
      .then(function(response) {
        const _response = response.text().then(function(text) { return text; });
        return _response;
      })
      .then(function(json) {
        if (Config.debug) {
          dispatch(logGuiHttp({
            'timestamp': _timestamp,
            'status': 'success',
            'response': json,
          }));
        }

        if (json.indexOf('"code":') > -1) {
          const _message = json.substring(
            `${json.indexOf('"message":"')}11`,
            json.indexOf('"},"id":"jl777"')
          );

          dispatch(
            triggerToaster(
              true,
              _message,
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error'
            )
          );

          if (json.indexOf('"code":-4') > -1) {
            dispatch(
              triggerToaster(
                true,
                translate('TOASTR.WALLET_NOTIFICATION'),
                translate('API.WALLETDAT_MISMATCH'),
                'info',
                false
              )
            );
          }
        } else {
          dispatch(
            triggerToaster(
              translate('TOASTR.TX_SENT_ALT'),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'success'
            )
          );
        }
      })
    });
  }
}

export function getKMDOPIDState(json) {
  return {
    type: DASHBOARD_ACTIVE_COIN_NATIVE_OPIDS,
    opids: json,
  }
}

export function getKMDOPID(opid, coin) {
  let tmpopidOutput = '',
      ajaxDataToHex;

  if (opid === undefined) {
    ajaxDataToHex = null;
  } else {
    ajaxDataToHex = `["${opid}"]`;
  }

  return dispatch => {
    return iguanaHashHex(ajaxDataToHex, dispatch).then((hashHexJson) => {
      if (hashHexJson === '5b226e756c6c225d00') {
        hashHexJson = '';
      }

      let payload,
          passthruAgent = getPassthruAgent(coin),
          tmpIguanaRPCAuth = `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`;

      if (passthruAgent === 'iguana') {
        payload = {
          'userpass': tmpIguanaRPCAuth,
          'agent': passthruAgent,
          'method': 'passthru',
          'asset': coin,
          'function': 'z_getoperationstatus',
          'hex': hashHexJson,
        };
      } else {
        payload = {
          'userpass': tmpIguanaRPCAuth,
          'agent': passthruAgent,
          'method': 'passthru',
          'function': 'z_getoperationstatus',
          'hex': hashHexJson,
        };
      }

      const _timestamp = Date.now();
      if (Config.debug) {
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'function': 'getKMDOPID',
          'type': 'post',
          'url': Config.cli.default ? `http://127.0.0.1:${Config.agamaPort}/shepherd/cli` : `http://127.0.0.1:${Config.iguanaCorePort}`,
          'payload': payload,
          'status': 'pending',
        }));
      }

      let _fetchConfig = {
        method: 'POST',
        body: JSON.stringify(payload),
      };

      if (Config.cli.default) {
        payload = {
          mode: null,
          chain: coin,
          cmd: 'z_getoperationstatus'
        };

        _fetchConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 'payload': payload }),
        };
      }

      fetch(
        Config.cli.default ? `http://127.0.0.1:${Config.agamaPort}/shepherd/cli` : `http://127.0.0.1:${Config.iguanaCorePort}`,
        _fetchConfig
      )
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
            'getKMDOPID',
            'Error',
            'error'
          )
        );
      })
      .then(response => response.json())
      .then(json => {
        if (Config.cli.default) {
          json = json.result;
        }
        if (Config.debug) {
          dispatch(logGuiHttp({
            'timestamp': _timestamp,
            'status': 'success',
            'response': json,
          }));
        }
        dispatch(getKMDOPIDState(json));
      })
    })
  }
}

export function sendFromPromise(coin, address, amount) {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: coin,
      cmd: 'sendfrom',
      params: [
        address,
        amount
      ]
    };

    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'payload': payload }),
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      _fetchConfig
    )
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'sendFrom',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json.result ? json.result : json);
    })
  });
}