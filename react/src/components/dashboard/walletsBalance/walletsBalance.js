import React from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../translate/translate';
import {
  getDashboardUpdate,
  shepherdElectrumBalance,
} from '../../../actions/actionCreators';
import Store from '../../../store';

import WalletsBalanceRender from './walletsBalance.render';

class WalletsBalance extends React.Component {
  constructor() {
    super();
    this.state = {
      currentAddress: null,
    };
    this.isFullySynced = this.isFullySynced.bind(this);
    this.refreshBalance = this.refreshBalance.bind(this);
  }

  componentWillReceiveProps(props) {
    if (this.props.ActiveCoin.activeAddress) {
      this.setState(Object.assign({}, this.state, {
        currentAddress: this.props.ActiveCoin.activeAddress,
      }));
    }
  }

  isFullySynced() {
    const _progress = this.props.ActiveCoin.progress;

    if (_progress &&
        (Number(_progress.balances) +
        Number(_progress.validated) +
        Number(_progress.bundles) +
        Number(_progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
  }

  refreshBalance() {
    if (this.props.ActiveCoin.mode === 'native') {
      Store.dispatch(getDashboardUpdate(this.props.ActiveCoin.coin));
    } else if (this.props.ActiveCoin.mode === 'spv') {
      Store.dispatch(shepherdElectrumBalance(this.props.ActiveCoin.coin, this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub));
    }
  }

  renderBalance(type) {
    let _balance = 0;
    const _mode = this.props.ActiveCoin.mode;

    if (this.props.ActiveCoin.balance === 'connection error or incomplete data') {
      _balance = '-777';
    }

    if (_mode === 'native') {
      if (type === 'total' &&
          this.props.ActiveCoin.balance &&
          this.props.ActiveCoin.balance.total) {
        _balance = this.props.ActiveCoin.balance.total;
      }

      if (type === 'interest' &&
          this.props.ActiveCoin.progress &&
          this.props.ActiveCoin.progress.interest) {
        _balance = this.props.ActiveCoin.progress.interest;
      }

      if (type === 'private' &&
          this.props.ActiveCoin.balance &&
          this.props.ActiveCoin.balance.private) {
        _balance = this.props.ActiveCoin.balance.private;
      }

      if (type === 'transparent' &&
          this.props.ActiveCoin.balance &&
          this.props.ActiveCoin.balance.transparent) {
        _balance = this.props.ActiveCoin.balance.transparent;
      }
    } else if (_mode === 'spv' && this.props.ActiveCoin.balance.balance) {
      if (this.props.ActiveCoin.coin === 'KMD') {
        if (type === 'total' &&
            this.props.ActiveCoin.balance &&
            this.props.ActiveCoin.balance.total) {
          _balance = this.props.ActiveCoin.balance.total;
        }

        if (type === 'interest' &&
            this.props.ActiveCoin.balance &&
            this.props.ActiveCoin.balance.interest) {
          _balance = this.props.ActiveCoin.balance.interest;
        }

        if (type === 'transparent' &&
            this.props.ActiveCoin.balance &&
            this.props.ActiveCoin.balance.balance) {
          _balance = this.props.ActiveCoin.balance.balance;
        }
      } else {
        _balance = this.props.ActiveCoin.balance.balance;
      }
    }

    return Number(_balance);
  }

  isActiveCoinMode(coinMode) {
    return this.props.ActiveCoin.mode === coinMode;
  }

  renderLB(_translationID) {
    const _translationComponents = translate(_translationID).split('<br>');

    return _translationComponents.map((_translation) =>
      <span key={ `translate-${Math.random(0, 9) * 10}` }>
        {_translation}
        <br />
      </span>
    );
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.coin &&
        // TODO the conditions below should be merged when native mode is fully merged into the rest of the components
        this.props.ActiveCoin.activeSection === 'default' &&
        !this.props.ActiveCoin.send &&
        !this.props.ActiveCoin.receive) {
      return WalletsBalanceRender.call(this);
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
      mode: state.ActiveCoin.mode,
      send: state.ActiveCoin.send,
      receive: state.ActiveCoin.receive,
      balance: state.ActiveCoin.balance,
      cache: state.ActiveCoin.cache,
      activeSection: state.ActiveCoin.activeSection,
      activeAddress: state.ActiveCoin.activeAddress,
      progress: state.ActiveCoin.progress,
    },
    Dashboard: state.Dashboard,
  };
};

export default connect(mapStateToProps)(WalletsBalance);