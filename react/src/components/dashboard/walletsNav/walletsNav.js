import React from 'react';
import {
  copyCoinAddress,
  iguanaEdexBalance,
  toggleSendCoinForm,
  toggleReceiveCoinForm,
  toggleSendReceiveCoinForms,
  toggleDashboardActiveSection
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import {
  WalletsNavNoWalletRender,
  WalletsNavWithWalletRender
} from './walletsNav.render';

class WalletsNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nativeOnly: Config.iguanaLessMode,
    };
    this.toggleSendReceiveCoinForms = this.toggleSendReceiveCoinForms.bind(this);
    this.toggleNativeWalletInfo = this.toggleNativeWalletInfo.bind(this);
    this.toggleNativeWalletTransactions = this.toggleNativeWalletTransactions.bind(this);
    this.checkTotalBalance = this.checkTotalBalance.bind(this);
  }

  componentWillMount() {
    Store.dispatch(iguanaEdexBalance(this.props.ActiveCoin.coin));
  }

  copyMyAddress(address) {
    Store.dispatch(copyCoinAddress(address));
  }

  checkTotalBalance() {
    let _balance = '0';
    const _mode = this.props.ActiveCoin.mode;

    if (_mode === 'full') {
      _balance = this.props.ActiveCoin.balance || 0;
    } else if (_mode === 'basilisk') {
      if (this.props.ActiveCoin.cache) {
        const _cache = this.props.ActiveCoin.cache;
        const _coin = this.props.ActiveCoin.coin;
        const _address = this.props.ActiveCoin.activeAddress;

        if (_address &&
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
      if (this.props.ActiveCoin.balance &&
          this.props.ActiveCoin.balance.total) {
        _balance = this.props.ActiveCoin.balance.total;
      }
    }

    return _balance;
  }

  toggleSendReceiveCoinForms() {
    if (this.props.ActiveCoin.mode === 'native') {
      Store.dispatch(
        toggleDashboardActiveSection(
          this.props.ActiveCoin.nativeActiveSection === 'settings' ? 'default' : 'settings'
        )
      );
    } else {
      Store.dispatch(toggleSendReceiveCoinForms());
    }
  }

  toggleNativeWalletInfo() {
    Store.dispatch(toggleDashboardActiveSection('settings'));
  }

  toggleNativeWalletTransactions() {
    Store.dispatch(toggleDashboardActiveSection('default'));
  }

  toggleSendCoinForm(display) {
    if (this.props.ActiveCoin.mode === 'native') {
      Store.dispatch(
        toggleDashboardActiveSection(
          this.props.ActiveCoin.nativeActiveSection === 'send' ? 'default' : 'send'
        )
      );
    } else {
      Store.dispatch(toggleSendCoinForm(display));
    }
  }

  toggleReceiveCoinForm(display) {
    if (this.props.ActiveCoin.mode === 'native') {
      Store.dispatch(
        toggleDashboardActiveSection(
          this.props.ActiveCoin.nativeActiveSection === 'receive' ? 'default' : 'receive'
        )
      );
    } else {
      Store.dispatch(toggleReceiveCoinForm(display));
    }
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        !this.props.ActiveCoin.coin) {
      return WalletsNavNoWalletRender.call(this);
    }

    return WalletsNavWithWalletRender.call(this);
  }
}

export default WalletsNav;
