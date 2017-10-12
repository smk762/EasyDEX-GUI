import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import Store from '../../../store';
import {
  toggleClaimInterestModal,
  getListUnspent,
  getRawTransaction,
  copyString,
  sendToAddressPromise,
  triggerToaster
} from '../../../actions/actionCreators';
import { translate } from '../../../translate/translate';
import {
  ClaimInterestModalRender,
  _ClaimInterestTableRender
} from './claimInterestModal.render';

// TODO: promises

class ClaimInterestModal extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      isLoading: true,
      transactionsList: [],
      showZeroInterest: true,
      totalInterest: 0,
    };
    this.claimInterestTableRender = this.claimInterestTableRender.bind(this);
    this.toggleZeroInterest = this.toggleZeroInterest.bind(this);
    this.loadListUnspent = this.loadListUnspent.bind(this);
    this.checkTransactionsListLength = this.checkTransactionsListLength.bind(this);
  }

  componentWillMount() {
    this.loadListUnspent();
  }

  loadListUnspent() {
    let _transactionsList = [];
    let _totalInterest = 0;

    getListUnspent(this.props.ActiveCoin.coin)
    .then((json) => {
      if (json &&
          json.length) {
        for (let i = 0; i < json.length; i++) {
          getRawTransaction(this.props.ActiveCoin.coin, json[i].txid)
          .then((_json) => {
            _transactionsList.push({
              address: json[i].address,
              locktime: _json.locktime,
              amount: json[i].amount,
              interest: json[i].interest,
              txid: json[i].txid,
            });
            _totalInterest += Number(json[i].interest);

            if (i === json.length - 1) {
              this.setState({
                transactionsList: _transactionsList,
                isLoading: false,
                totalInterest: _totalInterest,
              });
            }
          });
        }
      }
    });
  }

  claimInterest(address, amount) {
    sendToAddressPromise(
      this.props.ActiveCoin.coin,
      this.state.transactionsList[0].address,
      this.props.ActiveCoin.balance.transparent
    ).then((json) => {
      if (json.error &&
          json.error.code) {
        Store.dispatch(
          triggerToaster(
            json.error.message,
            'Error',
            'error'
          )
        );
      } else if (json.result && json.result.length && json.result.length === 64) {
        Store.dispatch(
          triggerToaster(
            `${translate('TOASTR.CLAIM_INTEREST_BALANCE_SENT_P1')} ${this.state.transactionsList[0].address}. ${translate('TOASTR.CLAIM_INTEREST_BALANCE_SENT_P2')}`,
            translate('TOASTR.WALLET_NOTIFICATION'),
            'success',
            false
          )
        );
      }
    });
  }

  checkTransactionsListLength() {
    if (this.state.transactionsList &&
        this.state.transactionsList.length) {
      return true;
    } else if (!this.state.transactionsList || !this.state.transactionsList.length) {
      return false;
    }
  }

  toggleZeroInterest() {
    this.setState({
      showZeroInterest: !this.state.showZeroInterest,
    });
  }

  copyTxId(txid) {
    Store.dispatch(copyString(txid, translate('TOASTR.TXID_COPIED')));
  }

  claimInterestTableRender() {
    return _ClaimInterestTableRender.call(this);
  }

  componentWillReceiveProps(props) {
    if (props.Dashboard.displayClaimInterestModal !== this.state.open) {
      this.setState({
        open: props.Dashboard.displayClaimInterestModal,
      });
    }

    if (!this.state.open &&
        props.Dashboard.displayClaimInterestModal) {
      this.loadListUnspent();
    }
  }

  closeModal() {
    Store.dispatch(toggleClaimInterestModal(false));
  }

  render() {
    return ClaimInterestModalRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
      balance: state.ActiveCoin.balance,
      activeSection: state.ActiveCoin.activeSection,
    },
    Dashboard: {
      displayClaimInterestModal: state.Dashboard.displayClaimInterestModal,
    },
  };
};

export default connect(mapStateToProps)(ClaimInterestModal);
