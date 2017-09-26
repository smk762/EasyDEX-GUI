import { triggerToaster } from '../actionCreators';
import Config from '../../config';
import { DASHBOARD_UPDATE } from '../storeType';

export function getDashboardUpdate(coin, activeCoinProps) {
  return dispatch => {
    const _fetchConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coin: coin }),
    };

    return fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/native/dashboard/update`,
      _fetchConfig
    )
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'getDashboardUpdate',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(getDashboardUpdateState(json, coin));

      // dirty hack to trigger dashboard render
      if (!activeCoinProps.balance &&
          !activeCoinProps.addresses) {
        setTimeout(() => {
          dispatch(getDashboardUpdateState(json, coin));
        }, 100);
      }
    })
  }
}

export function getDashboardUpdateState(json, coin, fakeResponse) {
  // rescan or similar resource heavy process
  if (fakeResponse ||
      ((json.result['getinfo'].error && json.result['getinfo'].error === 'daemon is busy') &&
      (json.result['z_getoperationstatus'].error && json.result['z_getoperationstatus'].error === 'daemon is busy') &&
      (json.result['listtransactions'].error && json.result['listtransactions'].error === 'daemon is busy') &&
      (json.result['listtransactions'].error && json.result['listtransactions'].error === 'daemon is busy'))) {
    return {
      type: DASHBOARD_UPDATE,
      progress: null,
      opids: null,
      txhistory: null,
      balance: null,
      addresses: null,
      coin: coin,
      rescanInProgress: true,
    };
  } else {
    let _listtransactions = json.result['listtransactions'];

    if (_listtransactions &&
        _listtransactions.error) {
      _listtransactions = null;
    } else if (_listtransactions && _listtransactions.result && _listtransactions.result.length) {
      _listtransactions = _listtransactions.result;
    } else if (!_listtransactions || (!_listtransactions.result || !_listtransactions.result.length)) {
      _listtransactions = 'no data';
    }

    if (coin === 'CHIPS') {
      return {
        type: DASHBOARD_UPDATE,
        progress: json.result['getinfo'].result,
        opids: null,
        txhistory: _listtransactions,
        balance: { transparent: json.result['getbalance'].result, total: json.result['getbalance'].result },
        addresses: json.result['addresses'],
        coin: coin,
        rescanInProgress: false,
      };
    } else {
      return {
        type: DASHBOARD_UPDATE,
        progress: json.result['getinfo'].result,
        opids: json.result['z_getoperationstatus'].result,
        txhistory: _listtransactions,
        balance: json.result['z_gettotalbalance'].result,
        addresses: json.result['addresses'],
        coin: coin,
        rescanInProgress: false,
      };
    }
  }
}