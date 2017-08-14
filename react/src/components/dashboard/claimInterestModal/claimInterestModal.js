import React from 'react';
import ReactDOM from 'react-dom';
import Store from '../../../store';
import {
  toggleClaimInterestModal,
  getListUnspent,
  getRawTransaction,
  copyString,
  sendFromPromise
} from '../../../actions/actionCreators';
import { translate } from '../../../translate/translate';
import {
  ClaimInterestModalRender,
  _ClaimInterestTableRender
} from './claimInterestModal.render';

class ClaimInterestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isLoading: true,
      transactionsList: [],
      showZeroInterest: true,
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

    getListUnspent('KMD')
    .then((json) => {
      if (json &&
          json.length) {
        for (let i = 0; i < json.length; i++) {
          getRawTransaction('KMD', json[i].txid)
          .then((_json) => {
            _transactionsList.push({
              address: json[i].address,
              locktime: _json.locktime,
              amount: json[i].amount,
              interest: json[i].interest,
              txid: json[i].txid,
            });

            if (i === json.length - 1) {
              this.setState({
                transactionsList: _transactionsList,
                isLoading: false,
              });
            }
          });
        }
      }
    });
  }

  claimInterest(address, amount) {
    console.warn('claim interest', `${address} ${amount}`);
    /*sendFromPromise(address, amount)
    .then((json) => {
      console.warn(json);
    });*/
  }

  checkTransactionsListLength() {
    if (this.state.transactionsList && this.state.transactionsList.length) {
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
    Store.dispatch(copyString(txid, 'Transaction ID copied'));
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

export default ClaimInterestModal;