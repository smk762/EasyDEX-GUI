import React from 'react';
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
  ReceiveCoinRender
} from './receiveCoin.render';

// TODO: implement sorting
// TODO: fallback to localstorage/stores data in case iguana is taking too long to respond

class ReceiveCoin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDropMenu: false,
    };
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
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
    Store.dispatch(getNewKMDAddresses(this.props.coin, type));
  }

  renderAddressList(type) {
    if (this.props.addresses &&
      this.props.addresses[type] &&
      this.props.addresses[type].length) {
      let items = [];

      for (let i = 0; i < this.props.addresses[type].length; i++) {
        let address = this.props.addresses[type][i];

        if (this.isBasiliskMode() &&
          this.hasNoAmount(address)) {
          address.amount = this.props.cache && this.props.cache[this.props.coin][address.address]
          && this.props.cache[this.props.coin][address.address].getbalance.data
          && this.props.cache[this.props.coin][address.address].getbalance.data.balance ? this.props.cache[this.props.coin][address.address].getbalance.data.balance : 'N/A';
        }
        if (this.isBasiliskMode() &&
          this.hasNoInterest(address)) {
          address.interest = this.props.cache && this.props.cache[this.props.coin][address.address]
          && this.props.cache[this.props.coin][address.address].getbalance.data
          && this.props.cache[this.props.coin][address.address].getbalance.data.interest ? this.props.cache[this.props.coin][address.address].getbalance.data.interest : 'N/A';
        }

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
    // TODO nativeActiveSection === 'receive' should be removed when native mode is fully merged
    // into the rest of the components
    if (this.props &&
       (this.props.receive || (this.isNativeMode() && this.props.nativeActiveSection === 'receive'))) {
      return ReceiveCoinRender.call(this);
    }

    return null;
  }
}

export default ReceiveCoin;
