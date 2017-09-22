import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardChangeActiveCoin,
  getAddressesByAccount,
  getSyncInfo,
  startInterval,
  stopInterval,
  iguanaEdexBalance,
  getKMDAddressesNative,
  changeActiveAddress,
  getKMDOPID,
  getNativeTxHistory,
  getKMDBalanceTotal,
  getSyncInfoNative,
  getDebugLog,
  getDashboardUpdate
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';

import CoinTileItemRender from './coinTileItem.render';

const IGUNA_ACTIVE_HANDLE_TIMEOUT_COIND_NATIVE = 15000;
const COIND_DOWN_MODAL_FETCH_FAILURES_THRESHOLD = 5;

class CoinTileItem extends React.Component {
  constructor() {
    super();
  }

  // TODO: 1) cache native/full node data to file
  //       2) limit amount of req per update e.g. list of addresses don't change too often
  //       3) limit req in basilisk as much as possible incl. activehandle

  componentWillMount() {
    if (!this.props.ActiveCoin.coin) {
      let _coinSelected = false;
      let _mode;
      let _coin;
      let _coinMode = {};
      const modes = [
        'native',
      ];
      const allCoins = this.props.Main.coins;

      if (allCoins) {
        modes.map((mode) => {
          allCoins[mode].map((coin) => {
            if (!_coinSelected) {
              _coinSelected = true;
              _coin = coin;
              _mode = mode;
            }
            _coinMode[coin] = mode;
          });

          if (_coinMode['KMD'] &&
              _coinMode['KMD'] === 'native') {
            _coin = 'KMD';
            _mode = 'native';
          }
        });

        setTimeout(() => {
          this._dashboardChangeActiveCoin(_coin, _mode);
        }, 100);
      }
    }
  }

  dispatchCoinActions(coin, mode) {
    if (this.props.Dashboard &&
        this.props.Dashboard.activeSection === 'wallets') {
      if (mode === 'native') {
        // Store.dispatch(iguanaActiveHandle(true));
        const _propsDashboard = this.props.ActiveCoin;
        const syncPercentage = _propsDashboard && _propsDashboard.progress && (parseFloat(parseInt(_propsDashboard.progress.blocks, 10) * 100 / parseInt(_propsDashboard.progress.longestchain, 10)).toFixed(2)).replace('NaN', 0);

        if ((syncPercentage < 100 &&
            (!this.props.Dashboard.displayCoindDownModal || this.props.ActiveCoin.getinfoFetchFailures < COIND_DOWN_MODAL_FETCH_FAILURES_THRESHOLD)) ||
            this.props.ActiveCoin.rescanInProgress) {
          if (coin === 'KMD') {
            Store.dispatch(getDebugLog('komodo', 50));
          } else {
            Store.dispatch(getDebugLog('komodo', 50, coin));
          }
        }

        if ((!this.props.Dashboard.displayCoindDownModal || this.props.ActiveCoin.getinfoFetchFailures < COIND_DOWN_MODAL_FETCH_FAILURES_THRESHOLD) &&
            _propsDashboard.progress &&
            _propsDashboard.progress.blocks &&
            _propsDashboard.progress.longestchain &&
            syncPercentage) {
          Store.dispatch(
            getSyncInfoNative(
              coin,
              true,
              this.props.Dashboard.skipFullDashboardUpdate,
              this.props.ActiveCoin.rescanInProgress
            )
          );

          if (!this.props.Dashboard.skipFullDashboardUpdate) {
            Store.dispatch(getDashboardUpdate(coin, _propsDashboard));
          }
        } else {
          Store.dispatch(
            getSyncInfoNative(
              coin,
              null,
              this.props.Dashboard.skipFullDashboardUpdate,
              this.props.ActiveCoin.rescanInProgress
            )
          );
        }
      }
    }
  }

  _dashboardChangeActiveCoin(coin, mode) {
    if (coin !== this.props.ActiveCoin.coin) {
      Store.dispatch(dashboardChangeActiveCoin(coin, mode));
      setTimeout(() => {
        this.dispatchCoinActions(coin, mode);
      }, 100);
      if (mode === 'native') { // faster coin data load if fully synced
        setTimeout(() => {
          this.dispatchCoinActions(coin, mode);
        }, 1000);
      }

      if (!this.props.Interval.interval.sync) {
        Store.dispatch(
          stopInterval(
            'sync',
            this.props.Interval.interval
          )
        );
      }

      if (mode === 'native') {
        const _iguanaActiveHandle = setInterval(() => {
          this.dispatchCoinActions(coin, mode);
        }, IGUNA_ACTIVE_HANDLE_TIMEOUT_COIND_NATIVE);

        Store.dispatch(startInterval('sync', _iguanaActiveHandle));
      }
    }
  }

  render() {
    return CoinTileItemRender.call(this);
  }
}
const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
      addresses: state.ActiveCoin.addresses,
      mainBasiliskAddress: state.ActiveCoin.mainBasiliskAddress,
      progress: state.ActiveCoin.progress,
      rescanInProgress: state.ActiveCoin.rescanInProgress,
      getinfoFetchFailures: state.ActiveCoin.getinfoFetchFailures,
    },
    Dashboard: state.Dashboard,
    Interval: {
      interval: state.Interval.interval,
    },
    Main: state.Main,
  };
};

export default connect(mapStateToProps)(CoinTileItem);