import React from 'react';
import { translate } from '../../../translate/translate';
import addCoinOptionsCrypto from '../../addcoin/addcoinOptionsCrypto';
import addCoinOptionsAC from '../../addcoin/addcoinOptionsAC';
import Select from 'react-select';
import {
  triggerToaster,
  shepherdToolsBalance,
  shepherdToolsBuildUnsigned,
  shepherdToolsPushTx,
  shepherdToolsSeedToWif,
  shepherdToolsWifToKP,
  shepherdElectrumListunspent,
  shepherdCliPromise,
  shepherdElectrumSplitUtxoPromise,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import QRCode from 'qrcode.react';
import QRModal from '../qrModal/qrModal';

class Tools extends React.Component {
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
      string2qr: null,
      s2wSeed: '',
      s2wCoin: '',
      s2wisIguana: true,
      s2wResult: null,
      w2wWif: '',
      w2wCoin: '',
      w2wResult: null,
      utxoAddr: '',
      utxoCoin: '',
      utxoResult: null,
      balanceAddr: '',
      balanceCoin: '',
      balanceResult: null,
      utxoSplitCoin: 'BEER',
      utxoSplitList: null,
      utxoSplitPairsCount: 1,
      utxoSplitPairs: '10,0.002',
      utxoSplitRawtx: null,
      utxoSplitPushResult: null,
    };
    this.updateInput = this.updateInput.bind(this);
    this.updateSelectedCoin = this.updateSelectedCoin.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.getUnsignedTx = this.getUnsignedTx.bind(this);
    this.sendTx = this.sendTx.bind(this);
    this.closeQr = this.closeQr.bind(this);
    this.setActiveSection = this.setActiveSection.bind(this);
    this.seed2Wif = this.seed2Wif.bind(this);
    this.wif2wif = this.wif2wif.bind(this);
    this.getBalanceAlt = this.getBalanceAlt.bind(this);
    this.getUtxos = this.getUtxos.bind(this);
    this.toggleS2wIsIguana = this.toggleS2wIsIguana.bind(this);
    this.getUtxoSplit = this.getUtxoSplit.bind(this);
    this.splitUtxo = this.splitUtxo.bind(this);
  }

  splitUtxo() {
    let largestUTXO = { amount: 0 };

    for (let i = 0; i < this.state.utxoSplitList.length; i++) {
      if (Number(this.state.utxoSplitList[i].amount) > Number(largestUTXO.amount)) {
        largestUTXO = this.state.utxoSplitList[i];
      }
    }

    console.warn(`largest utxo ${largestUTXO.amount}`);
    console.warn(`largest utxo ${largestUTXO.amount}`);

    const utxoSize = largestUTXO.amount;
    const targetSizes = this.state.utxoSplitPairs.split(',');
    const wif = '';
    const address = '';
    let totalOutSize = 0;
    let _targets = [];

    console.warn(`total utxos ${this.state.utxoSplitPairsCount * targetSizes.length}`);
    console.warn(`total pairs ${this.state.utxoSplitPairsCount}`);
    console.warn(`utxo size ${utxoSize}`);
    console.warn(`utxo sizes`);
    console.warn(targetSizes);

    for (let i = 0; i < this.state.utxoSplitPairsCount; i++) {
      console.warn(`vout ${i} ${targetSizes[0]}`);
      console.warn(`vout ${i + 1} ${targetSizes[1]}`);
      _targets.push(Number(targetSizes[0]) * 100000000);
      _targets.push(Number(targetSizes[1]) * 100000000);
      totalOutSize += Number(targetSizes[0]) + Number(targetSizes[1]);
    }

    console.warn(`total out size ${totalOutSize}`);
    console.warn(`change ${utxoSize - totalOutSize}`);

    const payload = {
      wif,
      network: 'komodo',
      targets: _targets,
      utxo: [largestUTXO],
      changeAddress: address,
      outputAddress: address,
      change: Math.floor(Number(utxoSize - totalOutSize) * 100000000) - 10000, // 10k sat fee
    };

    shepherdElectrumSplitUtxoPromise(payload)
    .then((res) => {
      console.warn(res);

      if (res.msg === 'success') {
        //this.setState({
        //  utxoSplitRawtx: res.result,
        //});

        shepherdCliPromise(null, this.state.utxoSplitCoin, 'sendrawtransaction', [res.result])
        .then((res) => {
          console.warn(res);

          if (!res.error) {
            this.setState({
              utxoSplitPushResult: res.result,
            });
          } else {
            Store.dispatch(
              triggerToaster(
                res.result,
                'Split UTXO error',
                'error'
              )
            );
          }
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            'Split UTXO error',
            'error'
          )
        );
      }
    });
  }

  getUtxoSplit() {
    shepherdCliPromise(null, this.state.utxoSplitCoin, 'listunspent')
    .then((res) => {
      console.warn(res);

      if (!res.error) {
        this.setState({
          utxoSplitList: res.result,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            'Get UTXO error',
            'error'
          )
        );
      }
    });
  }

  getUtxos() {
    const _coin = this.state.utxoCoin.split('|');

    shepherdElectrumListunspent(_coin[0], this.state.utxoAddr)
    .then((res) => {
      if (res.msg === 'success') {
        this.setState({
          utxoResult: res.result,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            'Get UTXO error',
            'error'
          )
        );
      }
    });
  }

  getBalanceAlt() {
    const _coin = this.state.balanceCoin.split('|');

    shepherdToolsBalance(_coin[0], this.state.balanceAddr)
    .then((res) => {
      if (res.msg === 'success') {
        this.setState({
          balanceResult: res.result,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            'Get balance error',
            'error'
          )
        );
      }
    });
  }

  wif2wif() {
    const _coin = this.state.w2wCoin.split('|');

    shepherdToolsWifToKP(_coin[0], this.state.w2wWif)
    .then((res) => {
      // console.warn(res);

      if (res.msg === 'success') {
        this.setState({
          w2wResult: res.result,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            'Seed to wif error',
            'error'
          )
        );
      }
    });
  }

  seed2Wif() {
    const _coin = this.state.s2wCoin.split('|');

    shepherdToolsSeedToWif(
      this.state.s2wSeed,
      _coin[0],
      this.state.s2wisIguana
    )
    .then((res) => {
      // console.warn(res);

      if (res.msg === 'success') {
        this.setState({
          s2wResult: res.result,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            'Seed to wif error',
            'error'
          )
        );
      }
    });
  }

  sendTx(rawTx2Push) {
    let _txData = rawTx2Push.split(':');

    // console.warn(_txData);

    shepherdToolsPushTx(_txData[0], _txData[1])
    .then((res) => {
      // console.warn(res);

      this.setState({
        txPushResult: res.result,
        rawTx2Push,
      });
    });
  }

  getBalance() {
    const _coin = this.state.selectedCoin.split('|');

    shepherdToolsBalance(_coin[0], this.state.sendFrom)
    .then((res) => {
      if (res.msg === 'success') {
        this.setState({
          balance: res.result,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            'Offline tx signing',
            'error'
          )
        );
      }
    });
  }

  getUnsignedTx() {
    const _coin = this.state.selectedCoin.split('|');

    shepherdToolsBuildUnsigned(_coin[0], this.state.amount * 100000000, this.state.sendTo, this.state.sendFrom)
    .then((res) => {
      // console.warn(res);

      if (res.msg === 'success') {
        let tx2qr = 'agtx:';
        res = res.result;

        tx2qr += (res.network === 'komodo' ? 'KMD' : res.network) + ':' + res.outputAddress + ':' + res.changeAddress + ':' + res.value + ':' + res.change + ':u:';

        for (let i = 0; i < res.utxoSet.length; i++) {
          tx2qr += res.utxoSet[i].txid + ':' + res.utxoSet[i].value + ':' + res.utxoSet[i].vout + (i === res.utxoSet.length -1 ? '' : '-');
        }

        // console.warn(tx2qr);
        // console.warn('txqr length', tx2qr.length);

        // max 350 chars

        this.setState({
          tx2qr,
          utxo: res.utxoSet,
        });
      } else {
        Store.dispatch(
          triggerToaster(
            res.result,
            'Offline tx signing',
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

  setActiveSection(section) {
    this.setState({
      activeSection: section,
    });
  }

  toggleS2wIsIguana() {
    this.setState({
      s2wisIguana: !this.state.s2wisIguana,
    });
  }

  renderUTXOResponse() {
    const _utxos = this.state.utxoResult;
    const _coin = this.state.utxoCoin.split('|');
    let _items = [];

    if (_utxos &&
        _utxos.length) {
      for (let i = 0; i < _utxos.length; i++) {
        _items.push(
          <tr key={ `tools-utxos-${i}` }>
            <td>{ _utxos[i].amount }</td>
            <td>{ _utxos[i].confirmations }</td>
            <td>{ _utxos[i].vout }</td>
            { _coin[0] === 'KMD' &&
              <td>{ _utxos[i].locktime }</td>
            }
            <td>{ _utxos[i].txid }</td>
          </tr>
        );
      }
    }

    return (
      <table className="table table-hover dataTable table-striped">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Confirmations</th>
            <th>Vout</th>
            { _coin[0] === 'KMD' &&
              <th>Locktime</th>
            }
            <th>TxID</th>
          </tr>
        </thead>
        <tbody>
        { _items }
        </tbody>
        <tfoot>
          <tr>
            <th>Amount</th>
            <th>Confirmations</th>
            <th>Vout</th>
            { _coin[0] === 'KMD' &&
              <th>Locktime</th>
            }
            <th>TxID</th>
          </tr>
        </tfoot>
      </table>
    );
  }

  renderUTXOSplitResponse() {
    const _utxos = this.state.utxoSplitList;
    let _items = [];
    console.warn(_utxos);

    if (_utxos &&
        _utxos.length) {
      for (let i = 0; i < _utxos.length; i++) {
        _items.push(
          <tr key={ `tools-utxos-${i}` }>
            <td>{ _utxos[i].amount }</td>
            <td>{ _utxos[i].address }</td>
            <td>{ _utxos[i].confirmations }</td>
            <td>{ _utxos[i].vout }</td>
            <td>{ _utxos[i].txid }</td>
          </tr>
        );
      }
    }

    return (
      <table className="table table-hover dataTable table-striped">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Address</th>
            <th>Confirmations</th>
            <th>Vout</th>
            <th>TxID</th>
          </tr>
        </thead>
        <tbody>
        { _items }
        </tbody>
        <tfoot>
          <tr>
            <th>Amount</th>
            <th>Address</th>
            <th>Confirmations</th>
            <th>Vout</th>
            <th>TxID</th>
          </tr>
        </tfoot>
      </table>
    );
  }

  render() {
    return (
      <div className="page margin-left-0">
        <div className="page-content tools background--white">
          <div className="row">
            <div className="col-sm-12 no-padding-left">
              <h2>Tools</h2>
              <div className="margin-top-20">
                <button type="button"
                  className="btn btn-default"
                  onClick={ () => this.setActiveSection('offlinesig-create') }>
                  Offline signing create
                </button>
                <button type="button"
                  className="btn btn-default margin-left-20"
                  onClick={ () => this.setActiveSection('offlinesig-scan') }>
                  Offline signing scan
                </button>
                <button type="button"
                  className="btn btn-default margin-left-20"
                  onClick={ () => this.setActiveSection('string2qr') }>
                  String to QR
                </button>
                <button type="button"
                  className="btn btn-default margin-left-20"
                  onClick={ () => this.setActiveSection('seed2kp') }>
                  Seed to key pair
                </button>
                <button type="button"
                  className="btn btn-default margin-left-20"
                  onClick={ () => this.setActiveSection('wif2wif') }>
                  WIF to WIF
                </button>
                <button type="button"
                  className="btn btn-default margin-left-20"
                  onClick={ () => this.setActiveSection('balance') }>
                  Balance *
                </button>
                <button type="button"
                  className="btn btn-default margin-left-20"
                  onClick={ () => this.setActiveSection('utxo') }>
                  UTXO *
                </button>
                <button type="button"
                  className="btn btn-default margin-left-20 hide"
                  onClick={ () => this.setActiveSection('utxo-split') }>
                  Split UTXO **
                </button>
                <div className="margin-top-10">* Electrum</div>
              </div>
              <hr />
              { this.state.activeSection === 'offlinesig-create' &&
                <div className="row margin-left-10">
                  <h4 className="margin-top-20">Offline Transaction Signing</h4>
                  <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Coin</label>
                    <Select
                      name="selectedCoin"
                      className="col-sm-3"
                      value={ this.state.selectedCoin }
                      onChange={ (event) => this.updateSelectedCoin(event, 'selectedCoin') }
                      optionRenderer={ this.renderCoinOption }
                      valueRenderer={ this.renderCoinOption }
                      options={ addCoinOptionsCrypto().concat(addCoinOptionsAC()) } />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">{ translate('INDEX.SEND_FROM') }</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
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
                        Get balance
                    </button>
                    { this.state.balance &&
                      <label className="margin-left-20">Balance: { this.state.balance.balance } </label>
                    }
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">{ translate('INDEX.SEND_TO') }</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
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
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
                    <button
                      type="button"
                      className="btn btn-primary col-sm-2"
                      onClick={ this.getUnsignedTx }>
                        Generate unsigned tx QR
                    </button>
                  </div>
                  { this.state.tx2qr &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
                      <label className="control-label col-sm-1 no-padding-left">QR payload</label>
                      <textarea
                        rows="5"
                        cols="20"
                        className="col-sm-7"
                        value={ this.state.tx2qr }></textarea>
                    </div>
                  }
                  { this.state.tx2qr &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
                      <label className="control-label col-sm-2 no-padding-left">
                        UTXO count: { this.state.utxo.length }
                      </label>
                      { this.state.utxo.length > 3 &&
                        <div className="col-red margin-left-20 margin-top-5">cant encode a qr tx larger than 3 utxos!</div>
                      }
                    </div>
                  }
                  { this.state.tx2qr &&
                    this.state.utxo.length < 4 &&
                    <div className="offlinesig-qr">
                      <div className="margin-top-50 margin-bottom-70 center">
                        <div>
                          <QRCode
                            value={ this.state.tx2qr }
                            size={ 560 } />
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary col-sm-2"
                          onClick={ this.closeQr }>
                            Close
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
              { this.state.activeSection === 'offlinesig-scan' &&
                <div className="row margin-left-10">
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <h4 className="margin-top-20 no-padding-left">Push QR transaction</h4>
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <QRModal
                      mode="scan"
                      setRecieverFromScan={ this.sendTx } />
                  </div>
                  { this.state.rawTx2Push &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
                      <textarea
                        rows="5"
                        cols="20"
                        className="col-sm-7 no-padding-left"
                        value={ this.state.rawTx2Push }></textarea>
                    </div>
                  }
                  { this.state.txPushResult &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
                      { this.state.txPushResult.length === 64 &&
                        <div>
                          <div className="margin-bottom-15">
                            { this.state.rawTx2Push.split(':')[0].toUpperCase() } transaction pushed!
                          </div>
                          <div>TxID { this.state.txPushResult }</div>
                        </div>
                      }
                      { this.state.txPushResult.length !== 64 &&
                        <div>Error: { this.state.txPushResult }</div>
                      }
                    </div>
                  }
                </div>
              }
              { this.state.activeSection === 'string2qr' &&
                <div className="row margin-left-10">
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <h4 className="margin-top-20 no-padding-left">String to QR</h4>
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <input
                      type="text"
                      className="form-control col-sm-5"
                      name="string2qr"
                      value={ this.state.string2qr }
                      onChange={ this.updateInput }
                      placeholder="Type a string here"
                      autoComplete="off" />
                  </div>
                  { this.state.string2qr &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-50 center">
                      <QRCode
                        value={ this.state.string2qr }
                        size={ 320 } />
                    </div>
                  }
                </div>
              }
              { this.state.activeSection === 'balance' &&
                <div className="row margin-left-10">
                  <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Coin</label>
                    <Select
                      name="balanceCoin"
                      className="col-sm-3"
                      value={ this.state.balanceCoin }
                      onChange={ (event) => this.updateSelectedCoin(event, 'balanceCoin') }
                      optionRenderer={ this.renderCoinOption }
                      valueRenderer={ this.renderCoinOption }
                      options={ addCoinOptionsCrypto().concat(addCoinOptionsAC()) } />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Address</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
                      name="balanceAddr"
                      onChange={ this.updateInput }
                      value={ this.state.balanceAddr }
                      placeholder={ translate('SEND.ENTER_ADDRESS') }
                      autoComplete="off"
                      required />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
                    <button
                      type="button"
                      className="btn btn-info col-sm-2"
                      onClick={ this.getBalanceAlt }>
                        Get balance
                    </button>
                  </div>
                  { this.state.balanceResult &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
                      <div>
                        <strong>Balance (confirmed):</strong> { this.state.balanceResult.balance }
                      </div>
                      <div className="margin-top-10">
                        <strong>Balance (unconfirmed):</strong> { this.state.balanceResult.unconfirmed }
                      </div>
                    </div>
                  }
                </div>
              }
              { this.state.activeSection === 'utxo' &&
                <div className="row margin-left-10">
                  <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Coin</label>
                    <Select
                      name="utxoCoin"
                      className="col-sm-3"
                      value={ this.state.utxoCoin }
                      onChange={ (event) => this.updateSelectedCoin(event, 'utxoCoin') }
                      optionRenderer={ this.renderCoinOption }
                      valueRenderer={ this.renderCoinOption }
                      options={ addCoinOptionsCrypto().concat(addCoinOptionsAC()) } />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Address</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
                      name="utxoAddr"
                      onChange={ this.updateInput }
                      value={ this.state.utxoAddr }
                      placeholder={ translate('SEND.ENTER_ADDRESS') }
                      autoComplete="off"
                      required />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
                    <button
                      type="button"
                      className="btn btn-info col-sm-2"
                      onClick={ this.getUtxos }>
                        Get UTXO(s)
                    </button>
                  </div>
                  { this.state.utxoResult &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
                      { this.renderUTXOResponse() }
                    </div>
                  }
                </div>
              }
              { this.state.activeSection === 'wif2wif' &&
                <div className="row margin-left-10">
                  <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Coin</label>
                    <Select
                      name="w2wCoin"
                      className="col-sm-3"
                      value={ this.state.w2wCoin }
                      onChange={ (event) => this.updateSelectedCoin(event, 'w2wCoin') }
                      optionRenderer={ this.renderCoinOption }
                      valueRenderer={ this.renderCoinOption }
                      options={ addCoinOptionsCrypto().concat(addCoinOptionsAC()) } />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">WIF</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
                      name="w2wWif"
                      onChange={ this.updateInput }
                      value={ this.state.w2wWif }
                      placeholder="Enter a WIF"
                      autoComplete="off"
                      required />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
                    <button
                      type="button"
                      className="btn btn-info col-sm-2"
                      onClick={ this.wif2wif }>
                        Get WIF
                    </button>
                  </div>
                  { this.state.w2wResult &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
                      <div>
                        <strong>WIF:</strong> { this.state.w2wResult.keys.priv }
                      </div>
                      <div className="margin-top-10">
                        <strong>Pub:</strong> { this.state.w2wResult.keys.pub }
                      </div>
                    </div>
                  }
                </div>
              }
              { this.state.activeSection === 'seed2kp' &&
                <div className="row margin-left-10">
                  <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Coin</label>
                    <Select
                      name="s2wCoin"
                      className="col-sm-3"
                      value={ this.state.s2wCoin }
                      onChange={ (event) => this.updateSelectedCoin(event, 's2wCoin') }
                      optionRenderer={ this.renderCoinOption }
                      valueRenderer={ this.renderCoinOption }
                      options={ addCoinOptionsCrypto().concat(addCoinOptionsAC()) } />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Passphrase</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
                      name="s2wSeed"
                      onChange={ this.updateInput }
                      value={ this.state.s2wSeed }
                      placeholder="Enter a passphrase"
                      autoComplete="off"
                      required />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={ this.state.s2wisIguana } />
                      <div
                        className="slider"
                        onClick={ this.toggleS2wIsIguana }></div>
                    </label>
                    <div
                      className="toggle-label pointer iguana-core-toggle"
                      onClick={ this.toggleS2wIsIguana }>
                      Iguana Core compatible
                    </div>
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
                    <button
                      type="button"
                      className="btn btn-info col-sm-2"
                      onClick={ this.seed2Wif }>
                        Get WIF
                    </button>
                  </div>
                  { this.state.s2wResult &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
                      <div>
                        <strong>WIF:</strong> { this.state.s2wResult.keys.priv }
                      </div>
                      <div className="margin-top-10">
                        <strong>Pub:</strong> { this.state.s2wResult.keys.pub }
                      </div>
                    </div>
                  }
                </div>
              }
              { this.state.activeSection === 'utxo-split' &&
                <div className="row margin-left-10">
                  <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Coin</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
                      name="utxoSplitCoin"
                      onChange={ this.updateInput }
                      value={ this.state.utxoSplitCoin }
                      placeholder="Coin"
                      autoComplete="off"
                      required />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
                    <button
                      type="button"
                      className="btn btn-info col-sm-2"
                      onClick={ this.getUtxoSplit }>
                        Get UTXO(s)
                    </button>
                  </div>
                  <hr />
                  <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Pair sizes</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
                      name="utxoSplitPairs"
                      onChange={ this.updateInput }
                      value={ this.state.utxoSplitPairs }
                      placeholder="Pair sizes"
                      autoComplete="off"
                      required />
                  </div>
                  <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
                    <label
                      className="control-label col-sm-1 no-padding-left"
                      htmlFor="kmdWalletSendTo">Number of pairs</label>
                    <input
                      type="text"
                      className="form-control col-sm-3"
                      name="utxoSplitPairsCount"
                      onChange={ this.updateInput }
                      value={ this.state.utxoSplitPairsCount }
                      placeholder="Pairs"
                      autoComplete="off"
                      required />
                  </div>
                  <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
                    <button
                      type="button"
                      className="btn btn-info col-sm-2"
                      onClick={ this.splitUtxo }>
                        Split UTXO(s)
                    </button>
                  </div>
                  { this.state.utxoSplitList &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
                      { /*this.renderUTXOSplitResponse()*/ }
                      Total UTXO: { this.state.utxoSplitList.length }
                    </div>
                  }
                  { this.state.utxoSplitRawtx &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
                      Rawtx: <div style={{ wordBreak: 'break-all' }}>{ this.state.utxoSplitRawtx }</div>
                    </div>
                  }
                  { this.state.utxoSplitPushResult &&
                    <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
                      TXID: <div style={{ wordBreak: 'break-all' }}>{ this.state.utxoSplitPushResult }</div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tools;