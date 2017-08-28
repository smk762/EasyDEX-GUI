import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Store from '../../../store';
import { translate } from '../../../translate/translate';
import BodyEnd from '../bodyBottom/bodyBottom';
import {
  InvoiceModalRender,
  InvoiceModalButtonRender,
} from './invoiceModal.render';

class InvoiceModal extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      content: '',
      amount: 0,
      addressSelectorOpen: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.renderAddressList = this.renderAddressList.bind(this);
    this.openDropMenu = this.openDropMenu.bind(this);
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  updateInput(e) {
    console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
      content: e.target.value,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      addressSelectorOpen: !this.state.addressSelectorOpen,
    }));
  }

  renderAddressByType(type) {
    const _addresses = this.props.ActiveCoin.addresses;

    if (_addresses &&
        _addresses[type] &&
        _addresses[type].length) {
      if (this.state.sendApiType) {
        const mainAddress = this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin];
        const mainAddressAmount = this.renderAddressAmount(mainAddress);

        return(
          <li
            key={ mainAddress }
            className={ mainAddressAmount <= 0 ? 'hide' : '' }>
            <a onClick={ () => this.updateAddressSelection(mainAddress, type, mainAddressAmount) }>
              <i className={ 'icon fa-eye' + (type === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
              <span className="text">
                [ { mainAddressAmount } { this.props.ActiveCoin.coin } ]&nbsp;&nbsp;
                { mainAddress }
              </span>
              <span className="glyphicon glyphicon-ok check-mark"></span>
            </a>
          </li>
        );
      } else {
        let items = [];
        const _addresses = this.props.ActiveCoin.addresses;
        const _cache = this.props.ActiveCoin.cache;
        const _coin = this.props.ActiveCoin.coin;

        for (let i = 0; i < _addresses[type].length; i++) {
          const address = _addresses[type][i].address;
          let _amount = address.amount;

          if (this.props.ActiveCoin.mode === 'basilisk' &&
              _cache) {
            _amount = _cache[_coin][address] && _cache[_coin][address].getbalance.data && _cache[_coin][address].getbalance.data.balance ? _cache[_coin][address].getbalance.data.balance : 'N/A';
          }

          if (_amount !== 'N/A') {
            items.push(
              <li
                key={ address }
                className={ _amount <= 0 ? 'hide' : '' }>
                <a onClick={ () => this.updateAddressSelection(address, type, _amount) }>
                  <i className={ 'icon fa-eye' + (type === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
                  <span className="text">[ { _amount } { _coin } ]  { address }</span>
                  <span className="glyphicon glyphicon-ok check-mark"></span>
                </a>
              </li>
            );
          }
        }

        return items;
      }
    } else {
      return null;
    }
  }

  renderSelectorCurrentLabel() {
    if (this.state.sendFrom) {
      let _amount;
      const _cache = this.props.ActiveCoin.cache;
      const _coin = this.props.ActiveCoin.coin;
      const _sendFrom = this.state.sendFrom;

      if (this.state.sendFromAmount === 0 &&
          this.props.ActiveCoin.mode === 'basilisk' &&
          _cache) {
        _amount = _cache[_coin][_sendFrom].getbalance.data && _cache[_coin][_sendFrom].getbalance.data.balance ? _cache[_coin][_sendFrom].getbalance.data.balance : 'N/A';
      } else {
        _amount = this.state.sendFromAmount;
      }

      return (
        <span>
          <i className={ 'icon fa-eye' + (this.state.addressType === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
          <span className="text">[ { _amount } { _coin } ]  { _sendFrom }</span>
        </span>
      );
    } else if (this.state.sendApiType) {
      const mainAddress = this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin];
      const mainAddressAmount = this.renderAddressAmount(mainAddress);

      return (
        <span>
          <i className={ 'icon fa-eye' + (this.state.addressType === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
          <span className="text">[ { mainAddressAmount } { this.props.ActiveCoin.coin } ]  { mainAddress }</span>
        </span>
      );
    } else {
      return (
        <span>{ translate('SEND.SELECT_T_OR_Z_ADDR') }</span>
      );
    }
  }

  renderAddressList() {
    return (
      <div className={ `btn-group bootstrap-select form-control form-material showkmdwalletaddrs show-tick ${(this.state.addressSelectorOpen ? 'open' : '')}` }>
        <button
          type="button"
          className="btn dropdown-toggle btn-info"
          title={ `${translate('SEND.SELECT_T_OR_Z_ADDR')}` }
          onClick={ this.openDropMenu }>
          <span className="filter-option pull-left">
            { this.renderSelectorCurrentLabel() }&nbsp;&nbsp;
          </span>
          <span className="bs-caret">
            <span className="caret"></span>
          </span>
        </button>
        <div className="dropdown-menu open">
          <ul className="dropdown-menu inner">
            <li className="selected">
              <a>
                <span className="text">{ translate('SEND.SELECT_T_OR_Z_ADDR') }</span>
                <span className="glyphicon glyphicon-ok check-mark"></span>
              </a>
            </li>
            { this.renderAddressByType('public') }
          </ul>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.modalIsOpen) {
      return <BodyEnd>{ InvoiceModalRender.call(this) }</BodyEnd>
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
    }

  };
 
};

export default connect(mapStateToProps)(InvoiceModal);
