import { DASHBOARD_ACTIVE_COIN_NATIVE_OPIDS } from '../storeType';
import { translate } from '../../translate/translate';
import { triggerToaster } from '../actionCreators';
import Config from '../../config';

export function sendNativeTx(coin, _payload) {
  let payload;
  let _apiMethod;

  // iguana core
  if ((_payload.addressType === 'public' && // transparent
      _payload.sendTo.length !== 95) || !_payload.sendFrom) {
    _apiMethod = 'sendtoaddress';
  } else { // private
    _apiMethod = 'z_sendmany';
  }

  return dispatch => {
    payload = {
      mode: null,
      chain: coin,
      cmd: _apiMethod,
      params:
        (_payload.addressType === 'public' && _payload.sendTo.length !== 95) || !_payload.sendFrom ?
        (_payload.substractFee ?
          [
            _payload.sendTo,
            _payload.amount,
            '',
            '',
            true
          ]
          :
          [
            _payload.sendTo,
            _payload.amount
          ]
        )
        :
        [
          _payload.sendFrom,
          [{
            address: _payload.sendTo,
            amount: _payload.amount
          }]
        ]
    };

    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: payload }),
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      _fetchConfig
    )
    .catch(function(error) {
      console.log(error);
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
      if (json.indexOf('"code":') > -1) {
        const _message = json.substring(
          `${json.indexOf('"message":"')}11`,
          json.indexOf('"},"id":"jl777"')
        );

        if (json.indexOf('"code":-4') > -1) {
          dispatch(
            triggerToaster(
              translate('API.WALLETDAT_MISMATCH'),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'info',
              false
            )
          );
        } else if (json.indexOf('"code":-5') > -1) {
          dispatch(
            triggerToaster(
              translate('TOASTR.INVALID_ADDRESS', coin),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error',
            )
          );
        } else {
          dispatch(
            triggerToaster(
              _message,
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error'
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
  }
}

export function getKMDOPIDState(json) {
  return {
    type: DASHBOARD_ACTIVE_COIN_NATIVE_OPIDS,
    opids: json,
  }
}

// remove
export function getKMDOPID(opid, coin) {
  let tmpopidOutput = '';
  let ajaxDataToHex;

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

      let payload;
      let passthruAgent = getPassthruAgent(coin);
      let tmpIguanaRPCAuth = `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`;

      if (passthruAgent === 'iguana') {
        payload = {
          userpass: tmpIguanaRPCAuth,
          agent: passthruAgent,
          method: 'passthru',
          asset: coin,
          function: 'z_getoperationstatus',
          hex: hashHexJson,
        };
      } else {
        payload = {
          userpass: tmpIguanaRPCAuth,
          agent: passthruAgent,
          method: 'passthru',
          function: 'z_getoperationstatus',
          hex: hashHexJson,
        };
      }

      let _fetchConfig = {
        method: 'POST',
        body: JSON.stringify(payload),
      };

      if (Config.cli.default) {
        payload = {
          mode: null,
          chain: coin,
          cmd: 'z_getoperationstatus',
        };

        _fetchConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payload: payload }),
        };
      }

      fetch(
        Config.cli.default ? `http://127.0.0.1:${Config.agamaPort}/shepherd/cli` : `http://127.0.0.1:${Config.iguanaCorePort}`,
        _fetchConfig
      )
      .catch(function(error) {
        console.log(error);
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
        dispatch(getKMDOPIDState(json));
      })
    })
  }
}

export function sendToAddressPromise(coin, address, amount) {
  return new Promise((resolve, reject) => {
    const payload = {
      mode: null,
      chain: coin,
      cmd: 'sendtoaddress',
      params: [
        address,
        amount,
        'KMD interest claim request',
        'KMD interest claim request',
        true
      ],
    };

    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload: payload }),
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      _fetchConfig
    )
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'sendToAddress',
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