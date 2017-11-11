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
  getDashboardUpdate,
  shepherdElectrumBalance,
  shepherdElectrumTransactions,
  shepherdElectrumCoins,
  electrumServerChanged,
  shepherdStopCoind,
  getDexCoins,
  activeHandle,
  triggerToaster,
  shepherdRemoveCoin,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';

import CoinTileItemRender from './coinTileItem.render';

const SPV_DASHBOARD_UPDATE_TIMEOUT = 60000;
const ACTIVE_HANDLE_TIMEOUT_COIND_NATIVE = 15000;
const COIND_DOWN_MODAL_FETCH_FAILURES_THRESHOLD = window.require('electron').remote.getCurrentWindow().appConfig.failedRPCAttemptsThreshold || 10;

class CoinTileItem extends React.Component {
  constructor() {
    super();
    this.state = {
      appConfig: {},
    };
    this.autoSetActiveCoin = this.autoSetActiveCoin.bind(this);
  }

  autoSetActiveCoin() {
    const modes = [
      'native',
      'spv',
    ];
    const allCoins = this.props.Main.coins;
    let _coinSelected = false;
    let _mode;
    let _coin;
    let _coinMode = {};

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
        } else if (_coinMode['KMD'] && _coinMode['KMD'] === 'spv') {
          _coin = 'KMD';
          _mode = 'spv';
        }
      });

      setTimeout(() => {
        this._dashboardChangeActiveCoin(_coin, _mode);
      }, 100);
    }
  }

  componentWillMount() {
    if (!this.props.ActiveCoin.coin) {
      this.autoSetActiveCoin();
    }

    let appConfig;

    try {
      appConfig = window.require('electron').remote.getCurrentWindow().appConfig;
    } catch (e) {}

    this.setState({
      appConfig,
    });
  }

  removeCoin(coin) {
    shepherdRemoveCoin(coin)
    .then((res) => {
      Store.dispatch(
        triggerToaster(
          `${coin} is removed`,
          'Coin notification',
          'success'
        )
      );
      Store.dispatch(getDexCoins());
      Store.dispatch(activeHandle());
      setTimeout(() => {
        this.autoSetActiveCoin();
      }, 500);
    });
  }

  stopCoind(coin) {
    shepherdStopCoind(coin)
    .then((res) => {
      if (res.msg === 'error') {
        Store.dispatch(
          triggerToaster(
            `Unable to stop ${coin}. Try again.`,
            'Error',
            'error'
          )
        );
      } else {
        Store.dispatch(
          triggerToaster(
            `${coin} is stopped`,
            'Coin notification',
            'success'
          )
        );

        Store.dispatch(getDexCoins());
        Store.dispatch(activeHandle());
        setTimeout(() => {
          this.autoSetActiveCoin();
        }, 500);
      }
    });
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

      if (mode === 'spv') {
        Store.dispatch(shepherdElectrumBalance(coin, this.props.Dashboard.electrumCoins[coin].pub));
        Store.dispatch(shepherdElectrumTransactions(coin, this.props.Dashboard.electrumCoins[coin].pub));
      }
    }
  }

  _dashboardChangeActiveCoin(coin, mode) {
    if (coin !== this.props.ActiveCoin.coin) {
      Store.dispatch(dashboardChangeActiveCoin(coin, mode));
      setTimeout(() => {
        this.dispatchCoinActions(coin, mode);
      }, 100);

      if (mode === 'native' ||
          mode === 'spv') { // faster coin data load if fully synced
        setTimeout(() => {
          this.dispatchCoinActions(coin, mode);
        }, 1000);
      }

      if (this.props.Interval.interval.sync) {
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
        }, ACTIVE_HANDLE_TIMEOUT_COIND_NATIVE);

        Store.dispatch(startInterval('sync', _iguanaActiveHandle));
      } else if (mode === 'spv') {
        const _iguanaActiveHandle = setInterval(() => {
          this.dispatchCoinActions(coin, mode);
        }, SPV_DASHBOARD_UPDATE_TIMEOUT);

        Store.dispatch(startInterval('sync', _iguanaActiveHandle));
      }
    }
  }

  componentWillReceiveProps(props) {
    if (this.props &&
        this.props.Dashboard &&
        this.props.Dashboard.eletrumServerChanged &&
        this.props.ActiveCoin.mode === 'spv' &&
        this.props.Dashboard &&
        this.props.Dashboard.activeSection === 'wallets') {
      Store.dispatch(shepherdElectrumBalance(this.props.ActiveCoin.coin, this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub));
      Store.dispatch(shepherdElectrumTransactions(this.props.ActiveCoin.coin, this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub));
      Store.dispatch(electrumServerChanged(false));
      setTimeout(() => {
        Store.dispatch(electrumServerChanged(false));
      }, 100);
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
      mode: state.ActiveCoin.mode,
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