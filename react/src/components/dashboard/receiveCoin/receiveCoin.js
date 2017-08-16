import React from 'react';
import { connect } from 'react-redux';
import {
  copyCoinAddress,
  checkAddressBasilisk,
  validateAddressBasilisk,
  getNewKMDAddresses
} from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  AddressActionsBasiliskModeRender,
  AddressActionsNonBasiliskModeRender,
  AddressItemRender,
  ReceiveCoinRender,
  _ReceiveCoinTableRender
} from './receiveCoin.render';

// TODO: implement balance/interest sorting
// TODO: fallback to localstorage/stores data in case iguana is taking too long to respond

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

  _checkAddressBasilisk(address) {
    Store.dispatch(
      checkAddressBasilisk(
        this.props.coin,
        address
      )
    );
  }

  _validateAddressBasilisk(address) {
    Store.dispatch(
      validateAddressBasilisk(
        this.props.coin,
        address
      )
    );
  }

  _copyCoinAddress(address) {
    Store.dispatch(copyCoinAddress(address));
  }

  isBasiliskMode() {
    return this.props.mode === 'basilisk';
  }

  isNativeMode() {
    return this.props.mode == 'native';
  }

  renderAddressActions(address, type) {
    if (this.isBasiliskMode()) {
      return AddressActionsBasiliskModeRender.call(this, address);
    }

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
    const _mode = this.props.mode;

    if (_mode === 'full') {
      _balance = this.props.balance || 0;
    } else if (_mode === 'basilisk') {
      if (this.props.cache) {
        const _cache = this.props.cache;
        const _coin = this.props.coin;
        const _address = this.props.activeAddress;

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
      if (this.props.balance &&
          this.props.balance.total) {
        _balance = this.props.balance.total;
      }
    }

    return _balance;
  }

  renderAddressList(type) {
    const _addresses = this.props.addresses;
    const _cache = this.props.cache;
    const _coin = this.props.coin;

    if (_addresses &&
        _addresses[type] &&
        _addresses[type].length) {
      let items = [];

      for (let i = 0; i < _addresses[type].length; i++) {
        let address = _addresses[type][i];

        if (this.isBasiliskMode() &&
            this.hasNoAmount(address)) {
          address.amount = _cache && _cache[_coin][address.address] &&
            _cache[_coin][address.address].getbalance &&
            _cache[_coin][address.address].getbalance.data &&
            _cache[_coin][address.address].getbalance.data.balance ? _cache[_coin][address.address].getbalance.data.balance : 'N/A';
        }
        if (this.isBasiliskMode() &&
            this.hasNoInterest(address)) {
          address.interest = _cache && _cache[_coin][address.address] &&
            _cache[_coin][address.address].getbalance &&
            _cache[_coin][address.address].getbalance.data &&
            _cache[_coin][address.address].getbalance.data.interest ? _cache[_coin][address.address].getbalance.data.interest : 'N/A';
        }

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
       (this.props.receive || (this.isNativeMode() && this.props.activeSection === 'receive'))) {
      return ReceiveCoinRender.call(this);
    }

    return null;
  }
}
const mapStateToProps = (state) => {
  return {
    coin: state.ActiveCoin.coin,
    mode: state.ActiveCoin.mode,
    receive: state.ActiveCoin.receive,
    balance: state.ActiveCoin.balance,
    cache: state.ActiveCoin.cache,
    nativeActiveSection: state.ActiveCoin.nativeActiveSection,
    activeAddress: state.ActiveCoin.activeAddress,
    addresses: state.ActiveCoin.addresses
  };
 
};

export default connect(mapStateToProps)(ReceiveCoin);