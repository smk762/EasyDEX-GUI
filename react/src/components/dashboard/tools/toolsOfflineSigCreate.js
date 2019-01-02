import React from 'react';
import translate from '../../../translate/translate';
import addCoinOptionsCrypto from '../../addcoin/addcoinOptionsCrypto';
import addCoinOptionsAC from '../../addcoin/addcoinOptionsAC';
import Select from 'react-select';
import {
  copyString,
  apiToolsBalance,
  apiToolsBuildUnsigned,
  apiToolsPushTx,
  apiToolsSeedToWif,
  apiToolsWifToKP,
  apiElectrumListunspent,
  apiCliPromise,
  apiElectrumSplitUtxoPromise,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import QRCode from 'qrcode.react';
import QRModal from '../qrModal/qrModal';
import { toSats } from 'agama-wallet-lib/src/utils';

// TODO: btc handling, address/amount validation

class ToolsOfflineSigCreate extends React.Component {
  constructor() {
    super();
    this.state = {
      sendFrom: '',
      sendTo: '',
      amount: 0,
      selectedCoin: '',
      balance: null,
      tx2qr: null,
      utxo: null,
      rawTx2Push: null,
      txPushResult: null,
    };
    this.updateInput = this.updateInput.bind(this);
    this.updateSelectedCoin = this.updateSelectedCoin.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.getUnsignedTx = this.getUnsignedTx.bind(this);
    this.setSendAmountAll = this.setSendAmountAll.bind(this);
    this.closeQr = this.closeQr.bind(this);
    this.copyTx = this.copyTx.bind(this);
  }

  copyTx() {
    Store.dispatch(copyString(this.state.tx2qr, 'Unsigned transaction is copied to clipboard'));
  }

  setSendAmountAll() {
    this.setState({
      amount: this.state.balance.balance,
    });
  }

  getBalance() {
    const _coin = this.state.selectedCoin.split('|');

    apiToolsBalance(
      _coin[0],
      this.state.sendFrom
    )
    .then((res) => {
      if (res.msg === 'success') {
        this.setState({
          balance: res.result,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            translate('TOOLS.ERR_OFFLINE_TX_SIG'),
            'error'
          )
        );
      }
    });
  }

  getUnsignedTx() {
    const _coin = this.state.selectedCoin.split('|');

    apiToolsBuildUnsigned(
      _coin[0],
      toSats(this.state.amount),
      this.state.sendTo,
      this.state.sendFrom
    )
    .then((res) => {
      if (res.msg === 'success') {
        res.result.coin = _coin[0].toLowerCase();

        this.setState({
          tx2qr: JSON.stringify(res.result),
          utxo: res.result.utxoSet,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            translate('TOOLS.ERR_OFFLINE_TX_SIG'),
            'error'
          )
        );
      }
    });
  }

  closeQr() {
    this.setState({
      tx2qr: null,
    });
  }

  renderCoinOption(option) {
    return (
      <div>
        <img
          src={ `assets/images/cryptologo/${option.icon.toLowerCase()}.png` }
          alt={ option.label }
          width="30px"
          height="30px" />
        <span className="margin-left-10">{ option.label }</span>
      </div>
    );
  }

  updateSelectedCoin(e, propName) {
    if (e &&
        e.value &&
        e.value.indexOf('|')) {
      this.setState({
        [propName]: e.value,
      });
    }
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    return (
      <div className="row margin-left-10">
        <div className="col-xlg-12 form-group form-material no-padding-left padding-bottom-10">
          <h4>{ translate('TOOLS.OFFLINE_TX_SIG') }</h4>
        </div>
        <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
          <label
            className="control-label col-sm-1 no-padding-left"
            htmlFor="kmdWalletSendTo">
            { translate('TOOLS.COIN') }
          </label>
          <Select
            name="selectedCoin"
            className="col-sm-3"
            value={ this.state.selectedCoin }
            onChange={ (event) => this.updateSelectedCoin(event, 'selectedCoin') }
            optionRenderer={ this.renderCoinOption }
            valueRenderer={ this.renderCoinOption }
            options={
              addCoinOptionsCrypto('skip', true)
              .concat(addCoinOptionsAC('skip'))
            } />
        </div>
        <div className="col-sm-12 form-group form-material no-padding-left">
          <label
            className="control-label col-sm-1 no-padding-left"
            htmlFor="kmdWalletSendTo">
            { translate('INDEX.SEND_FROM') }
          </label>
          <input
            type="text"
            className="form-control col-sm-3 blur"
            name="sendFrom"
            onChange={ this.updateInput }
            value={ this.state.sendFrom }
            id="kmdWalletSendTo"
            placeholder={ translate('SEND.ENTER_ADDRESS') }
            autoComplete="off"
            required />
        </div>
        <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
          <button
            type="button"
            className="btn btn-info col-sm-2"
            onClick={ this.getBalance }>
            { translate('TOOLS.GET_BALANCE') }
          </button>
          { this.state.balance &&
            <label className="margin-left-20">
            { translate('TOOLS.BALANCE') }: { this.state.balance.balance }
            </label>
          }
        </div>
        <div className="col-sm-12 form-group form-material no-padding-left">
          <label
            className="control-label col-sm-1 no-padding-left"
            htmlFor="kmdWalletSendTo">
            { translate('INDEX.SEND_TO') }
          </label>
          <input
            type="text"
            className="form-control col-sm-3 blur"
            name="sendTo"
            onChange={ this.updateInput }
            value={ this.state.sendTo }
            id="kmdWalletSendTo"
            placeholder={ translate('SEND.ENTER_ADDRESS') }
            autoComplete="off"
            required />
        </div>
        <div className="col-sm-12 form-group form-material no-padding-left">
          <label
            className="control-label col-sm-1 no-padding-left"
            htmlFor="kmdWalletAmount">
            { translate('INDEX.AMOUNT') }
          </label>
          <input
            type="text"
            className="form-control col-sm-3"
            name="amount"
            value={ this.state.amount }
            onChange={ this.updateInput }
            id="kmdWalletAmount"
            placeholder="0.000"
            autoComplete="off" />
          { this.state.balance &&
            this.state.balance.balance > 0 &&
            <button
              type="button"
              className="btn btn-default btn-send-self-offlinesig"
              onClick={ this.setSendAmountAll }>
              { translate('SEND.ALL') }
            </button>
          }
        </div>
        <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
          <button
            type="button"
            className="btn btn-primary col-sm-2"
            onClick={ this.getUnsignedTx }
            disabled={
              !this.state.balance ||
              !this.state.sendFrom ||
              !this.state.sendTo ||
              !this.state.selectedCoin
            }>
            Generate unsigned transaction
          </button>
        </div>
        { this.state.tx2qr &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
            <label className="control-label col-sm-3 no-padding-left">
            Unsigned transaction
            </label>
          </div>
        }
        { this.state.tx2qr &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
            <textarea
              rows="5"
              cols="20"
              className="col-sm-7"
              value={ this.state.tx2qr }></textarea>
            <button
              className="btn btn-default btn-xs clipboard-edexaddr margin-left-20"
              title={ translate('INDEX.COPY_TO_CLIPBOARD') }
              onClick={ this.copyTx }>
              <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
            </button>
          </div>
        }
      </div>
    );
  }
}

export default ToolsOfflineSigCreate;