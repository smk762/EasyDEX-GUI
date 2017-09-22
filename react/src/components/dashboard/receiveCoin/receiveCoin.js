import React from 'react';
import { connect } from 'react-redux';
import {
  copyCoinAddress,
  getNewKMDAddresses
} from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  AddressActionsNonBasiliskModeRender,
  AddressItemRender,
  ReceiveCoinRender,
  _ReceiveCoinTableRender
} from './receiveCoin.render';

// TODO: implement balance/interest sorting

class ReceiveCoin extends React.Component {
  constructor() {
    super();

    this.state = {
      openDropMenu: false,
      hideZeroAdresses: false,
    };
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleVisibleAddress = this.toggleVisibleAddress.bind(this);
    this.checkTotalBalance = this.checkTotalBalance.bind(this);
    this.ReceiveCoinTableRender = _ReceiveCoinTableRender.bind(this);
  }

  ReceiveCoinTableRender() {
    return this._ReceiveCoinTableRender();
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  handleClickOutside(e) {
    if (e.srcElement.className.indexOf('dropdown') === -1 &&
      (e.srcElement.offsetParent && e.srcElement.offsetParent.className.indexOf('dropdown') === -1)) {
      this.setState({
        openDropMenu: false,
      });
    }
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      openDropMenu: !this.state.openDropMenu,
    }));
  }

  _copyCoinAddress(address) {
    Store.dispatch(copyCoinAddress(address));
  }

  renderAddressActions(address, type) {
    return AddressActionsNonBasiliskModeRender.call(this, address, type);
  }

  hasNoAmount(address) {
    return address.amount === 'N/A' || address.amount === 0;
  }

  hasNoInterest(address) {
    return address.interest === 'N/A' || address.interest === 0 || !address.interest;
  }

  getNewAddress(type) {
    Store.dispatch(getNewKMDAddresses(this.props.coin, type, this.props.mode));
  }

  toggleVisibleAddress() {
    this.setState(Object.assign({}, this.state, {
      hideZeroAddresses: !this.state.hideZeroAddresses,
    }));
  }

  checkTotalBalance() {
    let _balance = '0';

    if (this.props.balance &&
        this.props.balance.total) {
      _balance = this.props.balance.total;
    }

    return _balance;
  }

  renderAddressList(type) {
    const _addresses = this.props.addresses;

    if (_addresses &&
        _addresses[type] &&
        _addresses[type].length) {
      let items = [];

      for (let i = 0; i < _addresses[type].length; i++) {
        let address = _addresses[type][i];

        if (this.state.hideZeroAddresses) {
          if (!this.hasNoAmount(address)) {
            items.push(
              AddressItemRender.call(this, address, type)
            );
          }
        } else {
          items.push(
            AddressItemRender.call(this, address, type)
          );
        }
      }

      return items;
    } else {
      return null;
    }
  }

  render() {
    // TODO activeSection === 'receive' should be removed when native mode is fully merged
    // into the rest of the components
    if (this.props &&
       (this.props.receive || this.props.activeSection === 'receive')) {
      return ReceiveCoinRender.call(this);
    }

    return null;
  }
}

const mapStateToProps = (state, props) => {
  let _mappedProps = {
    coin: state.ActiveCoin.coin,
    mode: state.ActiveCoin.mode,
    receive: state.ActiveCoin.receive,
    balance: state.ActiveCoin.balance,
    cache: state.ActiveCoin.cache,
    activeSection: state.ActiveCoin.activeSection,
    activeAddress: state.ActiveCoin.activeAddress,
    addresses: state.ActiveCoin.addresses,
  };

  if (props &&
      props.activeSection &&
      props.renderTableOnly) {
    _mappedProps.activeSection = props.activeSection;
    _mappedProps.renderTableOnly = props.renderTableOnly;
  }

  return _mappedProps;
};

export default connect(mapStateToProps)(ReceiveCoin);