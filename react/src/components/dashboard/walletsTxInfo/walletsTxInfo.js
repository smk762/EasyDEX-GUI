import React from 'react';
import { toggleDashboardTxInfoModal } from '../../../actions/actionCreators';
import Store from '../../../store';
import WalletsTxInfoRender from './walletsTxInfo.render';

class WalletsTxInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
    this.toggleTxInfoModal = this.toggleTxInfoModal.bind(this);
  }

  toggleTxInfoModal() {
    Store.dispatch(toggleDashboardTxInfoModal(false));
  }

  openTab(tab) {
    this.setState(Object.assign({}, this.state, {
      activeTab: tab,
    }));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.toggleTxInfoModal();
    }
  }

  isNativeMode() {
    return this.props.ActiveCoin.mode === 'native';
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin.showTransactionInfo &&
        // TODO the conditions below should be merged once the native mode components are fully merged
        // into the rest of the components
        (!this.isNativeMode() ||
         (this.isNativeMode() && this.props.ActiveCoin.nativeActiveSection === 'default'))) {
      const txInfo = this.props.ActiveCoin.txhistory[this.props.ActiveCoin.showTransactionInfoTxIndex];
      return WalletsTxInfoRender.call(this, txInfo);
    }

    return null;
  }
}

export default WalletsTxInfo;
