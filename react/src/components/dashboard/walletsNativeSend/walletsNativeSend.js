import React from 'react';
import { connect } from 'react-redux';
import Config from '../../../config';
import { translate } from '../../../translate/translate';
import { secondsToString } from '../../../util/time';
import {
  resolveOpenAliasAddress,
  triggerToaster,
  sendNativeTx,
  getKMDOPID
} from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  AddressListRender,
  OASendUIRender,
  WalletsNativeSendRender,
  WalletsNativeSendFormRender,
  _WalletsNativeSendFormRender
} from './walletsNativeSend.render';

class WalletsNativeSend extends React.Component {
  constructor() {
    super();
    this.state = {
      addressType: null,
      sendFrom: null,
      sendFromAmount: 0,
      sendTo: '',
      sendToOA: null,
      amount: 0,
      fee: 0,
      addressSelectorOpen: false,
      renderAddressDropdown: true,
    };
    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openDropMenu = this.openDropMenu.bind(this);
    this.getOAdress = this.getOAdress.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.checkZAddressCount = this.checkZAddressCount.bind(this);
    this.setRecieverFromScan = this.setRecieverFromScan.bind(this);
    this.renderOPIDListCheck = this.renderOPIDListCheck.bind(this);
    this.WalletsNativeSendFormRender = _WalletsNativeSendFormRender.bind(this);
  }

  WalletsNativeSendFormRender() {
    return this._WalletsNativeSendFormRender();
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

  componentWillReceiveProps() {
    this.checkZAddressCount();
  }

  setRecieverFromScan(receiver) {
    this.setState({
      sendTo: receiver
    });

    document.getElementById('kmdWalletSendTo').focus();
  }

  handleClickOutside(e) {
    if (e.srcElement.className !== 'btn dropdown-toggle btn-info' &&
        (e.srcElement.offsetParent && e.srcElement.offsetParent.className !== 'btn dropdown-toggle btn-info') &&
        (e.path && e.path[4] && e.path[4].className.indexOf('showkmdwalletaddrs') === -1)) {
      this.setState({
        addressSelectorOpen: false,
      });
    }
  }

  checkZAddressCount() {
    if (this.props.ActiveCoin.addresses &&
        (!this.props.ActiveCoin.addresses.private ||
        this.props.ActiveCoin.addresses.private.length === 0)) {
      this.setState({
        renderAddressDropdown: false,
      });
    } else {
      this.setState({
        renderAddressDropdown: true,
      });
    }
  }

  renderAddressByType(type) {
    let _items = [];

    if (this.props.ActiveCoin.addresses &&
        this.props.ActiveCoin.addresses[type] &&
        this.props.ActiveCoin.addresses[type].length) {
      this.props.ActiveCoin.addresses[type].map((address) => {
        if (address.amount > 0) {
          _items.push(
            <li
              className="selected"
              key={ address.address }>
              <a onClick={ () => this.updateAddressSelection(address.address, type, address.amount) }>
                <i className={ 'icon fa-eye' + (type === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
                <span className="text">
                  [ { address.amount } { this.props.ActiveCoin.coin } ]&nbsp;&nbsp;
                  { type === 'public' ? address.address : address.address.substring(0, 34) + '...' }
                </span>
                <span
                  className="glyphicon glyphicon-ok check-mark pull-right"
                  style={{ display: this.state.sendFrom === address.address ? 'inline-block' : 'none' }}></span>
              </a>
            </li>
          );
        }
      });

      return _items;
    } else {
      return null;
    }
  }

  renderOPIDListCheck() {
    if (this.state.renderAddressDropdown &&
        this.props.ActiveCoin.opids &&
        this.props.ActiveCoin.opids.length) {
      return true;
    }
  }

  renderSelectorCurrentLabel() {
    if (this.state.sendFrom) {
      return (
        <span>
          <i className={ 'icon fa-eye' + this.state.addressType === 'public' ? '' : '-slash' }></i>
          <span className="text">
            [ { this.state.sendFromAmount } { this.props.ActiveCoin.coin } ]  
            { this.state.addressType === 'public' ? this.state.sendFrom : this.state.sendFrom.substring(0, 34) + '...' }
          </span>
        </span>
      );
    } else {
      return (
        <span>Transparent funds</span>
      );
    }
  }

  renderAddressList() {
    return AddressListRender.call(this);
  }

  renderOPIDLabel(opid) {
    const _satatusDef = {
      queued: {
        icon: 'warning',
        label: 'QUEUED'
      },
      executing: {
        icon: 'info',
        label: 'EXECUTING'
      },
      failed: {
        icon: 'danger',
        label: 'FAILED'
      },
      success: {
        icon: 'success',
        label: 'SUCCESS'
      }
    };

    return (
      <span className={ `label label-${_satatusDef[opid.status].icon}` }>
        <i className="icon fa-eye"></i>&nbsp;
        <span>{ translate(`KMD_NATIVE.${_satatusDef[opid.status].label}`) }</span>
      </span>
    );
  }

  renderOPIDResult(opid) {
    let isWaitingStatus = true;

    if (opid.status === 'queued') {
      isWaitingStatus = false;
      return (
        <i>{ translate('SEND.AWAITING') }...</i>
      );
    }
    if (opid.status === 'executing') {
      isWaitingStatus = false;
      return (
        <i>{ translate('SEND.PROCESSING') }...</i>
      );
    }
    if (opid.status === 'failed') {
      isWaitingStatus = false;
      return (
        <span>
          <strong>{ translate('SEND.ERROR_CODE') }:</strong> <span>{ opid.error.code }</span>
          <br />
          <strong>{ translate('KMD_NATIVE.MESSAGE') }:</strong> <span>{ opid.error.message }</span>
        </span>
      );
    }
    if (opid.status === 'success') {
      isWaitingStatus = false;
      return (
        <span>
          <strong>txid:</strong> <span>{ opid.result.txid }</span>
          <br />
          <strong>{ translate('KMD_NATIVE.EXECUTION_SECONDS') }:</strong> <span>{ opid.execution_secs }</span>
        </span>
      );
    }
    if (isWaitingStatus) {
      return (
        <span>{ translate('SEND.WAITING') }...</span>
      );
    }
  }

  renderOPIDList() {
    if (this.props.ActiveCoin.opids &&
        this.props.ActiveCoin.opids.length) {
      return this.props.ActiveCoin.opids.map((opid) =>
        <tr key={ opid.id }>
          <td>{ this.renderOPIDLabel(opid) }</td>
          <td>{ opid.id }</td>
          <td>{ secondsToString(opid.creation_time) }</td>
          <td>{ this.renderOPIDResult(opid) }</td>
        </tr>
      );
    } else {
      return null;
    }
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      addressSelectorOpen: !this.state.addressSelectorOpen,
    }));
  }

  updateAddressSelection(address, type, amount) {
    this.setState(Object.assign({}, this.state, {
      sendFrom: address,
      addressType: type,
      sendFromAmount: amount,
      addressSelectorOpen: !this.state.addressSelectorOpen,
    }));
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit() {
    Store.dispatch(
      sendNativeTx(
        this.props.ActiveCoin.coin,
        this.state
      )
    );

    if (this.state.addressType === 'private') {
      setTimeout(() => {
        Store.dispatch(
          getKMDOPID(
            null,
            this.props.ActiveCoin.coin
          )
        );
      }, 1000);
    }

    this.setState({
      addressType: null,
      sendFrom: null,
      sendFromAmount: 0,
      sendTo: '',
      sendToOA: null,
      amount: 0,
      fee: 0,
      addressSelectorOpen: false,
      renderAddressDropdown: true,
    });
  }

  getOAdress() {
    resolveOpenAliasAddress(this.state.sendToOA)
    .then((json) => {
      const reply = json.Answer;

      if (reply &&
          reply.length) {
        for (let i = 0; i < reply.length; i++) {
          const _address = reply[i].data.split(' ');
          const coin = _address[0].replace('"oa1:', '');
          const coinAddress = _address[1].replace('recipient_address=', '').replace(';', '');

          if (coin.toUpperCase() === this.props.ActiveCoin.coin) {
            this.setState(Object.assign({}, this.state, {
              sendTo: coinAddress,
            }));
          }
        }

        if (this.state.sendTo === '') {
          Store.dispatch(
            triggerToaster(
              'Couldn\'t find any ' + this.props.ActiveCoin.coin + ' addresses',
              'OpenAlias',
              'error'
            )
          );
        }
      } else {
        Store.dispatch(
          triggerToaster(
            'Couldn\'t find any addresses',
            'OpenAlias',
            'error'
          )
        );
      }
    });
  }

  renderOASendUI() {
    if (Config.openAlias) {
      return OASendUIRender.call(this);
    }

    return null;
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        (this.props.ActiveCoin.nativeActiveSection === 'send' || this.props.nativeActiveSection === 'send')) {
      return WalletsNativeSendRender.call(this);
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      addresses: state.ActiveCoin.addresses,
      coin: state.ActiveCoin.coin,
      mode: state.ActiveCoin.mode,
      opids: state.ActiveCoin.opids,
      nativeActiveSection: state.ActiveCoin.nativeActiveSection,
    },
    renderFormOnly: state.renderFormOnly
  };
 
};

export default connect(mapStateToProps)(WalletsNativeSend);
