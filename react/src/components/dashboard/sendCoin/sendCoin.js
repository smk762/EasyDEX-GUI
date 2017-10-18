import React from 'react';
import { connect } from 'react-redux';
import Config from '../../../config';
import { translate } from '../../../translate/translate';
import { secondsToString } from '../../../util/time';
import {
  triggerToaster,
  sendNativeTx,
  getKMDOPID,
  clearLastSendToResponseState,
  shepherdElectrumSend,
  shepherdElectrumSendPreflight
} from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  AddressListRender,
  SendRender,
  SendFormRender,
  _SendFormRender
} from './sendCoin.render';
import { isPositiveNumber } from '../../../util/number';

// TODO: - add links to explorers
//       - render z address trim

class SendCoin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      addressType: null,
      sendFrom: null,
      sendFromAmount: 0,
      sendTo: '',
      amount: 0,
      fee: 0,
      addressSelectorOpen: false,
      renderAddressDropdown: true,
      substractFee: false,
      lastSendToResponse: null,
      coin: null,
      spvVerificationWarning: false,
      spvPreflightSendInProgress: false,
    };
    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.checkZAddressCount = this.checkZAddressCount.bind(this);
    this.setRecieverFromScan = this.setRecieverFromScan.bind(this);
    this.renderOPIDListCheck = this.renderOPIDListCheck.bind(this);
    this.SendFormRender = _SendFormRender.bind(this);
    this.isTransparentTx = this.isTransparentTx.bind(this);
    this.toggleSubstractFee = this.toggleSubstractFee.bind(this);
    this.isFullySynced = this.isFullySynced.bind(this);
  }

  SendFormRender() {
    return _SendFormRender.call(this);
  }

  toggleSubstractFee() {
    this.setState({
      substractFee: !this.state.substractFee,
    });
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

  componentWillReceiveProps(props) {
    this.checkZAddressCount(props);
  }

  setRecieverFromScan(receiver) {
    try {
      const recObj = JSON.parse(receiver);

      if (recObj &&
          typeof recObj === 'object') {
        if (recObj.coin === this.props.ActiveCoin.coin) {
          if (recObj.amount) {
            this.setState({
              amount: recObj.amount,
            });
          }
          if (recObj.address) {
            this.setState({
              sendTo: recObj.address,
            });
          }
        } else {
          Store.dispatch(
            triggerToaster(
              translate('SEND.QR_COIN_MISMATCH_MESSAGE_IMPORT_COIN') +
              recObj.coin +
              translate('SEND.QR_COIN_MISMATCH_MESSAGE_ACTIVE_COIN') +
              this.props.ActiveCoin.coin +
              translate('SEND.QR_COIN_MISMATCH_MESSAGE_END'),
              translate('SEND.QR_COIN_MISMATCH_TITLE'),
              'warning'
            )
          );
        }
      }
    } catch (e) {
      this.setState({
        sendTo: receiver,
      });
    }

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

  checkZAddressCount(props) {
    const _addresses = this.props.ActiveCoin.addresses;
    const _defaultState = {
      currentStep: 0,
      addressType: null,
      sendFrom: null,
      sendFromAmount: 0,
      sendTo: '',
      amount: 0,
      fee: 0,
      addressSelectorOpen: false,
      renderAddressDropdown: true,
      substractFee: false,
      lastSendToResponse: null,
    };
    let updatedState;

    if (_addresses &&
        (!_addresses.private ||
        _addresses.private.length === 0)) {
      updatedState = {
        renderAddressDropdown: false,
        lastSendToResponse: props.ActiveCoin.lastSendToResponse,
        coin: props.ActiveCoin.coin,
      };
    } else {
      updatedState = {
        renderAddressDropdown: true,
        lastSendToResponse: props.ActiveCoin.lastSendToResponse,
        coin: props.ActiveCoin.coin,
      };
    }

    if (this.state.coin !== props.ActiveCoin.coin) {
      this.setState(Object.assign({}, _defaultState, updatedState));
    } else {
      this.setState(updatedState);
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
        <span>{ this.props.ActiveCoin.mode === 'spv' ? `[ ${this.props.ActiveCoin.balance.balance} ${this.props.ActiveCoin.coin} ] ${this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub}` : translate('INDEX.T_FUNDS') }</span>
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
        label: 'QUEUED',
      },
      executing: {
        icon: 'info',
        label: 'EXECUTING',
      },
      failed: {
        icon: 'danger',
        label: 'FAILED',
      },
      success: {
        icon: 'success',
        label: 'SUCCESS',
      },
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
    } else if (opid.status === 'executing') {
      isWaitingStatus = false;
      return (
        <i>{ translate('SEND.PROCESSING') }...</i>
      );
    } else if (opid.status === 'failed') {
      isWaitingStatus = false;
      return (
        <span>
          <strong>{ translate('SEND.ERROR_CODE') }:</strong> <span>{ opid.error.code }</span>
          <br />
          <strong>{ translate('KMD_NATIVE.MESSAGE') }:</strong> <span>{ opid.error.message }</span>
        </span>
      );
    } else if (opid.status === 'success') {
      isWaitingStatus = false;
      return (
        <span>
          <strong>{ translate('KMD_NATIVE.TXID') }:</strong> <span>{ opid.result.txid }</span>
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

  changeSendCoinStep(step, back) {
    if (step === 0) {
      if (back) {
        this.setState({
          currentStep: 0,
          spvVerificationWarning: false,
          spvPreflightSendInProgress: false,
        });
      } else {
        Store.dispatch(clearLastSendToResponseState());

        this.setState({
          currentStep: 0,
          addressType: null,
          sendFrom: null,
          sendFromAmount: 0,
          sendTo: '',
          sendToOA: null,
          amount: 0,
          fee: 0,
          addressSelectorOpen: false,
          renderAddressDropdown: true,
          substractFee: false,
          spvVerificationWarning: false,
          spvPreflightSendInProgress: false,
        });
      }
    }

    if (step === 1) {
      if (!this.validateSendFormData()) {
        return;
      } else {
        this.setState(Object.assign({}, this.state, {
          spvPreflightSendInProgress: this.props.ActiveCoin.mode === 'spv' ? true : false,
          currentStep: step,
        }));

        // spv pre tx push request
        if (this.props.ActiveCoin.mode === 'spv') {
          shepherdElectrumSendPreflight(
            this.props.ActiveCoin.coin,
            this.state.amount * 100000000,
            this.state.sendTo,
            this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub
          ).then((sendPreflight) => {
            if (sendPreflight &&
                sendPreflight.msg === 'success') {
              this.setState(Object.assign({}, this.state, {
                spvVerificationWarning: !sendPreflight.result.utxoVerified,
                spvPreflightSendInProgress: false,
              }));
            } else {
              this.setState(Object.assign({}, this.state, {
                spvPreflightSendInProgress: false,
              }));
            }
          });
        }
      }
    }

    if (step === 2) {
      this.setState(Object.assign({}, this.state, {
        currentStep: step,
      }));
      this.handleSubmit();
    }
  }

  handleSubmit() {
    if (!this.validateSendFormData()) {
      return;
    }

    if (this.props.ActiveCoin.mode === 'native') {
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
    } else if (this.props.ActiveCoin.mode === 'spv') {
      // no op
      if (this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub) {
        Store.dispatch(
          shepherdElectrumSend(
            this.props.ActiveCoin.coin,
            this.state.amount * 100000000,
            this.state.sendTo,
            this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub
          )
        );
      }
    }
  }

  // TODO: reduce to a single toast
  validateSendFormData() {
    let valid = true;

    if (this.props.ActiveCoin.mode === 'spv') {
      const _amount = this.state.amount;
      const _amountSats = this.state.amount * 100000000;
      const _balanceSats = this.props.ActiveCoin.balance.balanceSats;

      if (_amountSats > _balanceSats) {
        Store.dispatch(
          triggerToaster(
            translate('SEND.INSUFFICIENT_FUNDS'),
            translate('TOASTR.WALLET_NOTIFICATION'),
            'error'
          )
        );
        valid = false;
      }
    }

    if (!this.state.sendTo ||
        this.state.sendTo.length < 34) {
      Store.dispatch(
        triggerToaster(
          translate('SEND.SEND_TO_ADDRESS_MIN_LENGTH'),
          translate('TOASTR.WALLET_NOTIFICATION'),
          'error'
        )
      );
      valid = false;
    }

    if (!isPositiveNumber(this.state.amount)) {
      Store.dispatch(
        triggerToaster(
          translate('SEND.AMOUNT_POSITIVE_NUMBER'),
          translate('TOASTR.WALLET_NOTIFICATION'),
          'error'
        )
      );
      valid = false;
    }

    if (((!this.state.sendFrom || this.state.addressType === 'public') &&
        this.state.sendTo &&
        this.state.sendTo.length === 34 &&
        this.props.ActiveCoin.balance &&
        this.props.ActiveCoin.balance.transparent &&
        Number(this.state.amount) > Number(this.props.ActiveCoin.balance.transparent)) ||
        (this.state.addressType === 'public' &&
        this.state.sendTo &&
        this.state.sendTo.length > 34 &&
        Number(this.state.amount) > Number(this.state.sendFromAmount)) ||
        (this.state.addressType === 'private' &&
        this.state.sendTo &&
        this.state.sendTo.length >= 34 &&
        Number(this.state.amount) > Number(this.state.sendFromAmount))) {
      Store.dispatch(
        triggerToaster(
          translate('SEND.INSUFFICIENT_FUNDS'),
          translate('TOASTR.WALLET_NOTIFICATION'),
          'error'
        )
      );
      valid = false;
    }

    if (this.state.sendTo.length > 34 &&
        (!this.state.sendFrom || this.state.sendFrom.length < 34)) {
      Store.dispatch(
        triggerToaster(
          translate('SEND.SELECT_SOURCE_ADDRESS'),
          translate('TOASTR.WALLET_NOTIFICATION'),
          'error'
        )
      );
      valid = false;
    }

    return valid;
  }

  isTransparentTx() {
    if (((this.state.sendFrom && this.state.sendFrom.length === 34) || !this.state.sendFrom) &&
        (this.state.sendTo && this.state.sendTo.length === 34)) {
      return true;
    }

    return false;
  }

  isFullySynced() {
    if (this.props.ActiveCoin.progress &&
        this.props.ActiveCoin.progress.longestchain &&
        this.props.ActiveCoin.progress.blocks &&
        this.props.ActiveCoin.progress.longestchain > 0 &&
        this.props.ActiveCoin.progress.blocks > 0 &&
        Number(this.props.ActiveCoin.progress.blocks) * 100 / Number(this.props.ActiveCoin.progress.longestchain) === 100) {
      return true;
    }
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        (this.props.ActiveCoin.activeSection === 'send' || this.props.activeSection === 'send')) {
      return SendRender.call(this);
    }

    return null;
  }
}

const mapStateToProps = (state, props) => {
  let _mappedProps = {
    ActiveCoin: {
      addresses: state.ActiveCoin.addresses,
      coin: state.ActiveCoin.coin,
      mode: state.ActiveCoin.mode,
      opids: state.ActiveCoin.opids,
      balance: state.ActiveCoin.balance,
      activeSection: state.ActiveCoin.activeSection,
      lastSendToResponse: state.ActiveCoin.lastSendToResponse,
      progress: state.ActiveCoin.progress,
    },
    Dashboard: state.Dashboard,
  };

  if (props &&
      props.activeSection &&
      props.renderFormOnly) {
    _mappedProps.ActiveCoin.activeSection = props.activeSection;
    _mappedProps.renderFormOnly = props.renderFormOnly;
  }

  return _mappedProps;
};

export default connect(mapStateToProps)(SendCoin);
