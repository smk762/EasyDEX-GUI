import { triggerToaster } from '../actionCreators';
import Config, {
  token,
  agamaPort,
  rpc2cli,
} from '../../config';
import { DASHBOARD_UPDATE } from '../storeType';
import fetchType from '../../util/fetchType';
import mainWindow from '../../util/mainWindow';
import translate from '../../translate/translate';

export const getDashboardUpdate = (coin, activeCoinProps) => {
  return dispatch => {
    return fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/native/dashboard/update`,
      fetchType(
        JSON.stringify({
          coin: coin,
          rpc2cli,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.shepherdElectrumBip39Keys') + ' (code: getDashboardUpdate)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      if (mainWindow.activeCoin === coin) {
        dispatch(getDashboardUpdateState(json, coin));

        // dirty hack to trigger dashboard render
        if (!activeCoinProps ||
            (activeCoinProps && !activeCoinProps.balance && !activeCoinProps.addresses)) {
          setTimeout(() => {
            dispatch(getDashboardUpdateState(json, coin));
          }, 100);
        }
      }
    });
  }
}

export const getDashboardUpdateState = (json, coin, fakeResponse) => {
  // rescan or similar resource heavy process
  if (fakeResponse ||
      ((json.result.getinfo.error && json.result.getinfo.error === 'daemon is busy') &&
      (json.result.z_getoperationstatus.error && json.result.z_getoperationstatus.error === 'daemon is busy') &&
      (json.result.listtransactions.error && json.result.listtransactions.error === 'daemon is busy'))) {
    return {
      type: DASHBOARD_UPDATE,
      progress: null,
      opids: null,
      txhistory: null,
      balance: null,
      addresses: null,
      coin: coin,
      getinfoFetchFailures: 0,
      rescanInProgress: true,
    };
  } else {
    let _listtransactions = json.result.listtransactions;

    if (_listtransactions &&
        _listtransactions.error) {
      _listtransactions = null;
    } else if (
      _listtransactions &&
      _listtransactions.result &&
      _listtransactions.result.length
    ) {
      _listtransactions = _listtransactions.result;
    } else if (
      !_listtransactions ||
      (!_listtransactions.result || !_listtransactions.result.length)
    ) {
      _listtransactions = 'no data';
    }

    if (coin === 'CHIPS') {
      return {
        type: DASHBOARD_UPDATE,
        progress: json.result.getinfo.result,
        opids: null,
        txhistory: _listtransactions,
        balance: {
          transparent: json.result.getbalance.result,
          total: json.result.getbalance.result,
        },
        addresses: json.result.addresses,
        coin,
        getinfoFetchFailures: 0,
        rescanInProgress: false,
      };
    } else {
      // calc transparent balance properly
      const _addresses = json.result.addresses;
      let _tbalance = 0;

      if (_addresses &&
          _addresses.public &&
          _addresses.public.length) {
        for (let i = 0; i < _addresses.public.length; i++) {
          _tbalance += _addresses.public[i].spendable;
        }
      }

      json.result.z_gettotalbalance.result.transparent = _tbalance.toFixed(8);
      json.result.z_gettotalbalance.result.total = Number(json.result.z_gettotalbalance.result.transparent) + Number(json.result.z_gettotalbalance.result.interest) + Number(json.result.z_gettotalbalance.result.private);
      json.result.z_gettotalbalance.result.total = json.result.z_gettotalbalance.result.total.toFixed(8);

      return {
        type: DASHBOARD_UPDATE,
        progress: json.result.getinfo.result,
        opids: json.result.z_getoperationstatus.result,
        txhistory: _listtransactions,
        balance: json.result.z_gettotalbalance.result,
        addresses: json.result.addresses,
        coin,
        getinfoFetchFailures: 0,
        rescanInProgress: false,
      };
    }
  }
}