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
import { connect } from 'react-redux';

class WalletsNav extends React.Component {
  constructor() {
    super();
    this.toggleSendReceiveCoinForms = this.toggleSendReceiveCoinForms.bind(this);

  }

  componentWillMount() {
    Store.dispatch(iguanaEdexBalance(this.props.activeCoin.coin));
  }

  copyMyAddress(address) {
    Store.dispatch(copyCoinAddress(address));
  }

  toggleSendReceiveCoinForms() {
    if (this.props.activeCoin.mode === 'native') {
      Store.dispatch(
        toggleDashboardActiveSection(
          this.props.activeCoin.nativeActiveSection === 'settings' ? 'default' : 'settings'
        )
      );
    } else {
      Store.dispatch(toggleSendReceiveCoinForms());
    }
  }

  toggleSendCoinForm(display) {
    if (this.props.activeCoin.mode === 'native') {
      Store.dispatch(
        toggleDashboardActiveSection(
          this.props.activeCoin.nativeActiveSection === 'send' ? 'default' : 'send'
        )
      );
    } else {
      Store.dispatch(toggleSendCoinForm(display));
    }
  }

  toggleReceiveCoinForm(display) {
    if (this.props.activeCoin.mode === 'native') {
      Store.dispatch(
        toggleDashboardActiveSection(
          this.props.activeCoin.nativeActiveSection === 'receive' ? 'default' : 'receive'
        )
      );
    } else {
      Store.dispatch(toggleReceiveCoinForm(display));
    }
  }

  render() {
    if (this.props &&
        this.props.activeCoin &&
        !this.props.activeCoin.coin) {
      return WalletsNavNoWalletRender.call(this);
    }

    return WalletsNavWithWalletRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    activeCoin: state.ActiveCoin,
    activeHandle: state.Dashboard.activeHandle,
    activeSection: state.Dashboard.activeSection,
    appSettings: state.Settings.appSettings
  };
};

export default connect(mapStateToProps)(WalletsNav);

