import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Store from '../../../store';
import { translate } from '../../../translate/translate';
import BodyEnd from '../bodyBottom/bodyBottom';
import {
  InvoiceModalRender,
  InvoiceModalButtonRender,
  AddressItemRender,
} from './invoiceModal.render';

class InvoiceModal extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      content: '',
      qrAddress: '',
      qrAmount: 0,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.renderAddressList = this.renderAddressList.bind(this);
    this.updateQRContent = this.updateQRContent.bind(this);
  }

  openModal() {
    this.setState({
      modalIsOpen: true,
    });
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    }, this.updateQRContent);
   }

  updateQRContent() {
    this.setState({
      content: JSON.stringify({
        address: this.state.qrAddress,
        amount: this.state.qrAmount,
        coin: this.props.ActiveCoin.coin,
      }),
    });
  }

   closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  hasNoAmount(address) {
    return address.amount === 'N/A' || address.amount === 0;
  }

  hasNoInterest(address) {
    return address.interest === 'N/A' || address.interest === 0 || !address.interest;
  }

  renderAddressList(type) {
    const _addresses = this.props.ActiveCoin.addresses;
    const _coin = this.props.ActiveCoin.coin;

    if (_addresses &&
        _addresses[type] &&
        _addresses[type].length) {
      let items = [];

      for (let i = 0; i < _addresses[type].length; i++) {
        let address = _addresses[type][i];

        items.push(
          AddressItemRender.call(this, address, type)
        );
      }

      return items;
    } else {
      return null;
    }
  }

  render() {
    if (this.state.modalIsOpen) {
      return <BodyEnd>{ InvoiceModalRender.call(this) }</BodyEnd>;
    } else {
      return InvoiceModalButtonRender.call(this);
    }
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
      activeAddress: state.ActiveCoin.activeAddress,
      lastSendToResponse: state.ActiveCoin.lastSendToResponse,
      addresses: state.ActiveCoin.addresses,
    },
    Dashboard: {
      activeHandle: state.Dashboard.activeHandle,
    },
  };
};

export default connect(mapStateToProps)(InvoiceModal);
