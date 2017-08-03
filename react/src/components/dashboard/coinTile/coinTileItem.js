import React from 'react';
import {
  dashboardChangeActiveCoin,
  iguanaActiveHandle,
  getAddressesByAccount,
  getSyncInfo,
  startInterval,
  stopInterval,
  iguanaEdexBalance,
  getKMDAddressesNative,
  getFullTransactionsList,
  getBasiliskTransactionsList,
  changeActiveAddress,
  getShepherdCache,
  fetchNewCacheData,
  getKMDOPID,
  getNativeTxHistory,
  getKMDBalanceTotal,
  getSyncInfoNative,
  getDebugLog
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';

import CoinTileItemRender from './coinTileItem.render';

const BASILISK_CACHE_UPDATE_TIMEOUT = 240000;
const IGUNA_ACTIVE_HANDLE_TIMEOUT = 3000;
const IGUNA_ACTIVE_HANDLE_TIMEOUT_KMD_NATIVE = 15000;
const NATIVE_MIN_SYNC_PERCENTAGE_THRESHOLD = 90;

class CoinTileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // TODO: 1) cache native/full node data to file
  //       2) limit amount of req per update e.g. list of addresses don't change too often
  //       3) limit req in basilisk as much as possible incl. activehandle

  dispatchCoinActions(coin, mode) {
    if (mode === 'native') {
      Store.dispatch(iguanaActiveHandle(true));
      const _propsDashboard = this.props.Dashboard;
      const syncPercentage = _propsDashboard && _propsDashboard.progress && (parseFloat(parseInt(_propsDashboard.progress.blocks, 10) * 100 / parseInt(this.props.Dashboard.progress.longestchain, 10)).toFixed(2)).replace('NaN', 0);

      if (syncPercentage < 100 &&
          !this.props.Dashboard.displayCoindDownModal) {
        Store.dispatch(getDebugLog('komodo', 10));
      }
      if (!this.props.Dashboard.displayCoindDownModal &&
          _propsDashboard.progress &&
          _propsDashboard.progress.blocks &&
          _propsDashboard.progress.longestchain &&
          syncPercentage &&
          (Config.iguanaLessMode || syncPercentage >= NATIVE_MIN_SYNC_PERCENTAGE_THRESHOLD)) {
        Store.dispatch(getSyncInfoNative(coin, true));
        Store.dispatch(getKMDBalanceTotal(coin));
        Store.dispatch(getNativeTxHistory(coin));
        Store.dispatch(getKMDAddressesNative(coin, mode));
        Store.dispatch(getKMDOPID(null, coin));
      } else {
        Store.dispatch(getSyncInfoNative(coin));
      }
    }
    if (mode === 'full') {
      Store.dispatch(iguanaActiveHandle(true));
      Store.dispatch(getSyncInfo(coin));
      Store.dispatch(iguanaEdexBalance(coin, mode));
      Store.dispatch(getAddressesByAccount(coin, mode));
      Store.dispatch(getFullTransactionsList(coin));
    }
    if (mode === 'basilisk') {
      const useAddress = this.props.ActiveCoin.mainBasiliskAddress ? this.props.ActiveCoin.mainBasiliskAddress : this.props.Dashboard.activeHandle[coin];

      Store.dispatch(iguanaActiveHandle(true));

      Store.dispatch(
        getKMDAddressesNative(
          coin,
          mode,
          useAddress
        )
      );

      Store.dispatch(
        getShepherdCache(
          JSON.parse(sessionStorage.getItem('IguanaActiveAccount')).pubkey,
          coin
        )
      );

      if (this.props &&
          this.props.Dashboard &&
          this.props.Dashboard.activeHandle &&
          this.props.Dashboard.activeHandle[coin]) {
        if (!this.props.ActiveCoin.addresses) {
          Store.dispatch(getAddressesByAccount(coin, mode));
        }

        Store.dispatch(getBasiliskTransactionsList(coin, useAddress));
      }
    }
  }

  dashboardChangeActiveCoin(coin, mode) {
    if (coin !== this.props.ActiveCoin.coin) {
      Store.dispatch(
        stopInterval(
          'sync',
          this.props.Interval.interval
        )
      );

      Store.dispatch(
        stopInterval(
          'basilisk',
          this.props.Interval.interval
        )
      );

      Store.dispatch(dashboardChangeActiveCoin(coin, mode));

      if (mode === 'full') {
        const _iguanaActiveHandle = setInterval(() => {
          this.dispatchCoinActions(coin, mode);
        }, IGUNA_ACTIVE_HANDLE_TIMEOUT);

        Store.dispatch(
          startInterval(
            'sync',
            _iguanaActiveHandle
          )
        );
      }
      if (mode === 'native') {
        const _iguanaActiveHandle = setInterval(() => {
          this.dispatchCoinActions(coin, mode);
        }, coin === 'KMD' ? IGUNA_ACTIVE_HANDLE_TIMEOUT_KMD_NATIVE : IGUNA_ACTIVE_HANDLE_TIMEOUT);

        Store.dispatch(startInterval('sync', _iguanaActiveHandle));
      }
      if (mode === 'basilisk') {
        const _activeHandle = this.props.Dashboard.activeHandle;
        const _basiliskMainAddress = _activeHandle[coin] || JSON.parse(sessionStorage.getItem('IguanaActiveAccount'))[coin];

        Store.dispatch(changeActiveAddress(_basiliskMainAddress));

        if (_basiliskMainAddress) {
          Store.dispatch(fetchNewCacheData({
            'pubkey': _activeHandle.pubkey,
            'allcoins': false,
            'coin': coin,
            'calls': 'listtransactions:getbalance',
            'address': _basiliskMainAddress,
          }));

          const _iguanaActiveHandle = setInterval(() => {
            this.dispatchCoinActions(coin, mode);
          }, IGUNA_ACTIVE_HANDLE_TIMEOUT);

          const _basiliskCache = setInterval(() => {
            Store.dispatch(fetchNewCacheData({
              'pubkey': _activeHandle.pubkey,
              'allcoins': false,
              'coin': this.props.ActiveCoin.coin,
              'calls': 'listtransactions:getbalance',
              'address': _basiliskMainAddress,
            }));
          }, BASILISK_CACHE_UPDATE_TIMEOUT);

          Store.dispatch(
            startInterval(
              'sync',
              _iguanaActiveHandle
            )
          );

          Store.dispatch(
            startInterval(
              'basilisk',
              _basiliskCache
            )
          );
        }
      }
    }
  }

  render() {
    return CoinTileItemRender.call(this);
  }
}

export default CoinTileItem;
