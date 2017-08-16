import React from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../translate/translate';
import {
  fetchNewCacheData,
  getKMDBalanceTotal,
  iguanaEdexBalance
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
    if (!this.state.currentAddress &&
        this.props.ActiveCoin.activeAddress) {
      this.setState(Object.assign({}, this.state, {
        currentAddress: this.props.ActiveCoin.activeAddress,
      }));
    }
  }

  isFullySynced() {
    if (this.props.Dashboard.progress &&
        (Number(this.props.Dashboard.progress.balances) +
        Number(this.props.Dashboard.progress.validated) +
        Number(this.props.Dashboard.progress.bundles) +
        Number(this.props.Dashboard.progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
  }

  refreshBalance() {
    const _mode = this.props.ActiveCoin.mode;
    const _coin = this.props.ActiveCoin.coin;

    switch(_mode) {
      case 'basilisk':
        Store.dispatch(fetchNewCacheData({
          'pubkey': this.props.Dashboard.activeHandle.pubkey,
          'allcoins': false,
          'coin': this.props.ActiveCoin.coin,
          'calls': 'getbalance',
          'skip': true,
          'address': this.state.currentAddress,
        }));
        break;
      case 'native':
        Store.dispatch(getKMDBalanceTotal(_coin));
        break;
      case 'full':
        Store.dispatch(iguanaEdexBalance(_coin));
        break;
    }
  }

  renderBalance(type) {
    let _balance = '0';
    const _mode = this.props.ActiveCoin.mode;

    if (_mode === 'full') {
      _balance = this.props.ActiveCoin.balance || 0;
    } else if (_mode === 'basilisk') {
      if (this.props.ActiveCoin.cache) {
        const _cache = this.props.ActiveCoin.cache;
        const _coin = this.props.ActiveCoin.coin;
        const _address = this.props.ActiveCoin.activeAddress;

        if (type === 'transparent' &&
            _address &&
            _cache[_coin] &&
            _cache[_coin][_address] &&
            _cache[_coin][_address].getbalance &&
            _cache[_coin][_address].getbalance.data &&
            _cache[_coin][_address].getbalance.data.balance) {
          _balance = _cache[_coin][_address].getbalance.data.balance;
        }

        if (type === 'interest' &&
            _address &&
            _cache[_coin] &&
            _cache[_coin][_address] &&
            _cache[_coin][_address].getbalance &&
            _cache[_coin][_address].getbalance.data &&
            _cache[_coin][_address].getbalance.data.interest) {
          _balance = _cache[_coin][_address].getbalance.data.interest;
        }

        if (type === 'total' &&
            _address &&
            _cache[_coin] &&
            _cache[_coin][_address] &&
            _cache[_coin][_address].getbalance &&
            _cache[_coin][_address].getbalance.data &&
            (_cache[_coin][_address].getbalance.data.balance ||
             _cache[_coin][_address].getbalance.data.interest)) {
          const _regBalance = _cache[_coin][_address].getbalance.data.balance ? _cache[_coin][_address].getbalance.data.balance : 0;
          const _regInterest = _cache[_coin][_address].getbalance.data.interest ? _cache[_coin][_address].getbalance.data.interest : 0;

          _balance = _regBalance + _regInterest;
        }
      }
    } else if (_mode === 'native') {
      if (type === 'total' &&
          this.props.ActiveCoin.balance &&
          this.props.ActiveCoin.balance.total) {
        _balance = this.props.ActiveCoin.balance.total;
      }

      if (type === 'interest' &&
          this.props.Dashboard.progress &&
          this.props.Dashboard.progress.interest) {
        _balance = this.props.Dashboard.progress.interest;
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
    }

    return _balance;
  }

  isActiveCoinMode(coinMode) {
    return this.props.ActiveCoin.mode === coinMode;
  }

  isBasiliskMode() {
    return this.isActiveCoinMode('basilisk');
  }

  isNativeMode() {
    return this.isActiveCoinMode('native');
  }

  isFullMode() {
    return this.isActiveCoinMode('full');
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

  isNativeBalanceActive() {
    return this.isNativeMode() && this.props.ActiveCoin.nativeActiveSection === 'default';
  }

  isNonNativeBalanceActive() {
    return !this.isNativeMode() && !this.props.ActiveCoin.send && !this.props.ActiveCoin.receive;
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.coin &&
        // TODO the conditions below should be merged when native mode is fully merged into the rest of the components
      (this.isNativeBalanceActive() || this.isNonNativeBalanceActive()))
    {
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
      nativeActiveSection: state.ActiveCoin.nativeActiveSection,
      activeAddress: state.ActiveCoin.activeAddress
    },
    Dashboard: {
      progress: state.Dashboard.progress,
    }
  };
 
};

export default connect(mapStateToProps)(WalletsBalance);