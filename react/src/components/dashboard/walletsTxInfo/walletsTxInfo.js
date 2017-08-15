import React from 'react';
import { sortByDate } from '../../../util/sort';
import { toggleDashboardTxInfoModal } from '../../../actions/actionCreators';
import Store from '../../../store';
import WalletsTxInfoRender from './walletsTxInfo.render';

class WalletsTxInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 0,
    };
    this.toggleTxInfoModal = this.toggleTxInfoModal.bind(this);
  }

  toggleTxInfoModal() {
    Store.dispatch(toggleDashboardTxInfoModal(false));

    this.setState(Object.assign({}, this.state, {
      activeTab: 0,
    }));
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
      const txInfo = sortByDate(this.props.ActiveCoin.txhistory)[this.props.ActiveCoin.showTransactionInfoTxIndex];
      return WalletsTxInfoRender.call(this, txInfo);
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      mode: state.ActiveCoin.mode,
      txhistory: state.ActiveCoin.txhistory,
      showTransactionInfo: state.ActiveCoin.showTransactionInfo,
      nativeActiveSection: state.ActiveCoin.nativeActiveSection,
      activeAddress: state.ActiveCoin.activeAddress,
    }
  };
 
};

export default connect(mapStateToProps)(WalletsTxInfo);
