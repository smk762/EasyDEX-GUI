import {
  triggerToaster,
} from '../actionCreators';
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
      dispatch(getDashboardUpdateState(json));

      // dirty hack to trigger dashboard render
      if (!activeCoinProps.balance &&
          !activeCoinProps.addresses) {
        setTimeout(() => {
          dispatch(getDashboardUpdateState(json));
        }, 100);
      }
    })
  }
}

export function getDashboardUpdateState(json) {
  let _listtransactions = json.result['listtransactions'];

  if (_listtransactions &&
      _listtransactions.error) {
    _listtransactions = null;
  } else if (_listtransactions && _listtransactions.result && _listtransactions.result.length) {
    _listtransactions = _listtransactions.result;
  } else if (!_listtransactions || (!_listtransactions.result || !_listtransactions.result.length)) {
    _listtransactions = 'no data';
  }

  return {
    type: DASHBOARD_UPDATE,
    progress: json.result['getinfo'].result,
    opids: json.result['z_getoperationstatus'].result,
    txhistory: _listtransactions,
    balance: json.result['z_gettotalbalance'].result,
    addresses: json.result['addresses'],
  };
}