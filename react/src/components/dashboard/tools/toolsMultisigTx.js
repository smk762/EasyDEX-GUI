import React from 'react';
import translate from '../../../translate/translate';
import addCoinOptionsCrypto from '../../addcoin/addcoinOptionsCrypto';
import addCoinOptionsAC from '../../addcoin/addcoinOptionsAC';
import Select from 'react-select';
import {
  triggerToaster,
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
import coinFees from 'agama-wallet-lib/src/fees';
import {
  secondsToString,
  checkTimestamp,
} from 'agama-wallet-lib/src/time';
import {
  explorerList,
  isKomodoCoin,
} from 'agama-wallet-lib/src/coin-helpers';
import {
  isPositiveNumber,
  fromSats,
  toSats,
  parseBitcoinURL,
} from 'agama-wallet-lib/src/utils';
import transactionBuilder from 'agama-wallet-lib/src/transaction-builder';
import mainWindow from '../../../util/mainWindow';
import networks from 'agama-wallet-lib/src/bitcoinjs-networks';
import { stringToWif } from 'agama-wallet-lib/src/keys';
import { msigPubAddress } from 'agama-wallet-lib/src/keys';

const { shell } = window.require('electron');

// TODO: btc handling

class ToolsMultisigTx extends React.Component {
  constructor() {
    super();
    this.state = {
      sendFrom: '',
      sendTo: '',
      amount: 0,
      selectedCoin: 'KMD|spv',
      balance: null,
      utxo: null,
      txPushResult: null,
      agamaGeneratedAddress: false,
      agamaMultisigData: null,
      agamaMultisigIncompleteTx: null,
      agamaMultisigIncompleteTxParsed: null,
      agamaMultisigTxOut: null,
      creator: true,
      seed: '',
    };
    this.updateInput = this.updateInput.bind(this);
    this.updateSelectedCoin = this.updateSelectedCoin.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.getUnsignedTx = this.getUnsignedTx.bind(this);
    this.setSendAmountAll = this.setSendAmountAll.bind(this);
    this.copyTx = this.copyTx.bind(this);
    this.copyTxData = this.copyTxData.bind(this);
    this.validateSendFormData = this.validateSendFormData.bind(this);
    this.toggleAgamaGen = this.toggleAgamaGen.bind(this);
    this.toggleCreator = this.toggleCreator.bind(this);
    this.verifyTx = this.verifyTx.bind(this);
    this.pushTx = this.pushTx.bind(this);
  }

  openExplorerWindow(txid) {
    const _coin = this.state.selectedCoin.split('|')[0].toUpperCase();
    const url = explorerList[_coin].split('/').length - 1 > 2 ? `${explorerList[_coin]}${txid}` : `${explorerList[_coin]}/tx/${txid}`;      
    return shell.openExternal(url);
  }

  pushTx() {
    apiToolsPushTx(
      this.state.selectedCoin.split('|')[0].toLowerCase(),
      this.state.agamaMultisigTxOut.rawtx
    )
    .then((res) => {
      // console.warn(res);

      this.setState({
        txPushResult: res.result,
      });
    });
  }

  verifyTx() {
    if (this.state.seed ||
        (this.state.agamaMultisigData && JSON.parse(this.state.agamaMultisigData).signKey)) {
      const _parsedIncompleteTxData = JSON.parse(this.state.agamaMultisigIncompleteTx);
      const _seed = this.state.agamaMultisigData && JSON.parse(this.state.agamaMultisigData).signKey ? JSON.parse(this.state.agamaMultisigData).signKey : this.state.seed;
      const _kp = stringToWif(_seed, _parsedIncompleteTxData.inputData.network, true);

      if (_parsedIncompleteTxData.sigs.indexOf(_kp.pubHex) > -1) {
        Store.dispatch(
          triggerToaster(
            'You already signed this transaction',
            translate('TOASTR.WALLET_NOTIFICATION'),
            'error'
          )
        );
      } else {
        this.setState({
          agamaMultisigIncompleteTxParsed: _parsedIncompleteTxData,
          seed: _seed, 
          selectedCoin: _parsedIncompleteTxData.inputData.coin.toUpperCase() + '|spv',
        });
      }
    } else {
      Store.dispatch(
        triggerToaster(
          'Missing signing key',
          translate('TOASTR.WALLET_NOTIFICATION'),
          'error'
        )
      );
    }
  }

  componentWillMount() {
    if (mainWindow.multisig) {
      this.setState({
        agamaMultisigData: JSON.stringify(mainWindow.multisig),
      });
    }
  }

  copyTxData() {
    Store.dispatch(copyString(JSON.stringify(this.state.agamaMultisigTxOut), 'Transaction data is copied'));
  }

  toggleAgamaGen() {
    this.setState({
      agamaGeneratedAddress: !this.state.agamaGeneratedAddress,
    });
  }

  toggleCreator() {
    this.setState({
      creator: !this.state.creator,
    });
  }

  validateSendFormData() {
    const _coin = this.state.selectedCoin.split('|')[0];
    const _mode = 'spv';
    let valid = true;

    if (_mode === 'spv') {
      const _customFee = toSats(this.state.fee);
      const _amount = this.state.amount;
      const _amountSats = Math.floor(toSats(this.state.amount));
      const _balanceSats = this.state.balance.balanceSats + this.state.balance.unconfirmedSats;
      let _fees = mainWindow.spvFees;
      _fees.BTC = 0;

      if (Number(_amountSats) + (_customFee || _fees[_coin]) > _balanceSats) {
        Store.dispatch(
          triggerToaster(
            `${translate('SEND.INSUFFICIENT_FUNDS')} ${translate('SEND.MAX_AVAIL_BALANCE')} ${Number((fromSats(_balanceSats - (_customFee || _fees[_coin]))).toFixed(8))} ${_coin}`,
            translate('TOASTR.WALLET_NOTIFICATION'),
            'error'
          )
        );
        valid = false;
      } else if (
        Number(_amountSats) < _fees[_coin] &&
        !this.state.kvSend
      ) {
        Store.dispatch(
          triggerToaster(
            `${translate('SEND.AMOUNT_IS_TOO_SMALL', this.state.amount)}, ${translate('SEND.MIN_AMOUNT_IS', _coin)} ${Number(fromSats(_fees[_coin]))}`,
            translate('TOASTR.WALLET_NOTIFICATION'),
            'error'
          )
        );
        valid = false;
      }

      if (this.state.fee &&
          !isPositiveNumber(this.state.fee)) {
        Store.dispatch(
          triggerToaster(
            translate('SEND.FEE_POSITIVE_NUMBER'),
            translate('TOASTR.WALLET_NOTIFICATION'),
            'error'
          )
        );
        valid = false;
      }
    }

    const _validateAddress = (type) => {
      let _validateAddress;
      let _msg;
  
      _validateAddress = mainWindow.addressVersionCheck(_coin, this.state[type]);
  
      if (_validateAddress === 'Invalid pub address' ||
          !_validateAddress) {
        _msg = `${this.state[type]} ${translate('SEND.VALIDATION_IS_NOT_VALID_ADDR_P1')} ${_coin} ${translate('SEND.VALIDATION_IS_NOT_VALID_ADDR_P2')}`;
      }
  
      if (_msg) {
        Store.dispatch(
          triggerToaster(
            _msg,
            translate('TOASTR.WALLET_NOTIFICATION'),
            'error'
          )
        );
        valid = false;
      }
    }

    if (this.state.sendFrom) {
      _validateAddress('sendFrom');
    }

    if (this.state.sendTo) {
      _validateAddress('sendTo');
    }

    if (this.state.amount &&
        !isPositiveNumber(this.state.amount)) {
      Store.dispatch(
        triggerToaster(
          translate('SEND.AMOUNT_POSITIVE_NUMBER'),
          translate('TOASTR.WALLET_NOTIFICATION'),
          'error'
        )
      );
      valid = false;
    }

    return valid;
  }

  copyTx() {
    Store.dispatch(copyString(this.state.tx2qr, 'Unsigned transaction is copied to clipboard'));
  }

  setSendAmountAll() {
    const _coin = this.state.selectedCoin.split('|')[0];

    this.setState({
      amount: this.state.balance.balance - fromSats(mainWindow.spvFees[_coin]),
    });
  }

  getBalance() {
    const _coin = this.state.selectedCoin.split('|')[0];
    let _sendFrom = this.state.sendFrom;

    if (!this.state.agamaGeneratedAddress) {
      try {
        const _multisigData = JSON.parse(this.state.agamaMultisigData);

        if (!_multisigData.hasOwnProperty('redeemScript') ||
            !_multisigData.hasOwnProperty('scriptPubKey') ||
            !_multisigData.hasOwnProperty('nOfN')) {
          Store.dispatch(
            triggerToaster(
              'Malformed multi signature data',
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error'
            )
          );
        } else {
          const _seed = _multisigData.signKey ? _multisigData.signKey : this.state.seed;

          _sendFrom = msigPubAddress(
            _multisigData.scriptPubKey,
            networks[_coin.toLowerCase()] || networks.kmd
          );
          this.setState({
            sendFrom: _sendFrom,
            seed: _seed,
          });
        }
      } catch (e) {
        console.warn(e);
        Store.dispatch(
          triggerToaster(
            'Malformed multi signature data',
            translate('TOASTR.WALLET_NOTIFICATION'),
            'error'
          )
        );
      }
    }

    apiToolsBalance(
      _coin,
      _sendFrom
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
    if (!this.state.creator ||
        (this.state.creator && this.validateSendFormData())) {
      const _coin = this.state.selectedCoin.split('|');
      const _createtx = (utxos) => {
        let _data;

        if (this.state.creator) {
          _data = transactionBuilder.data(
            networks[_coin[0].toLowerCase()] || networks.kmd,
            toSats(this.state.amount),
            mainWindow.spvFees[_coin[0].toUpperCase()],
            this.state.sendTo,
            this.state.sendFrom,
            utxos.result
          );
        } else {
          _data = this.state.agamaMultisigIncompleteTxParsed.inputData;
        }

        const _multisigData = JSON.parse(this.state.agamaMultisigData);
        const _kp = stringToWif(this.state.seed, _data.network, true);
        let _multisigOptions;
        let _sigs = [];
        
        if (this.state.creator) {
          _multisigOptions = {
            creator: this.state.creator,
            redeemScript: _multisigData.redeemScript,
            scriptPubKey: _multisigData.scriptPubKey,
          };

          if (_multisigData.nOfN !== '1-2') {
            _multisigOptions.incomplete = true;
          }
        } else {
          const _incompleteTx = JSON.parse(JSON.stringify(this.state.agamaMultisigIncompleteTxParsed));
          _sigs = _incompleteTx.sigs;

          // console.warn(_incompleteTx);
          
          _multisigOptions = {
            incomplete: _sigs.length + 1 === Number(_multisigData.nOfN.split('-')[0]) ? false : true, 
            rawtx: _incompleteTx.rawtx,
            redeemScript: _multisigData.redeemScript,
            scriptPubKey: _multisigData.scriptPubKey,
          };
        }

        // console.warn('_multisigOptions', _multisigOptions);

        _sigs.push(_kp.pubHex);

        /*console.warn('sigs ' + _sigs.length);
        if (_sigs.length === Number(_multisigData.nOfN.split('-')[0])) {
          console.warn('all sigs are here, complete tx');
        }*/

        const _multisigTx = transactionBuilder.transaction(
          _data.outputAddress,
          _data.changeAddress,
          _kp.priv,
          _data.network,
          _data.inputs,
          _data.change,
          _data.value,
          {
            multisig: _multisigOptions,
          }
        );

        // console.warn('data', _data);
        delete _multisigData.addresses;
        delete _multisigData.signKey;
        delete _multisigData.pubKeys;

        const _multisigOut = {
          sigs: _sigs,
          multisigData: _multisigData,
          rawtx: _multisigTx,
          inputData: {
            outputAddress: _data.outputAddress,
            changeAddress: _data.changeAddress,
            network: _data.network,
            inputs: _data.inputs,
            change: _data.change,
            value: _data.value,
            fee: _data.fee,
            from: msigPubAddress(
              _multisigData.scriptPubKey,
              networks[_coin[0].toLowerCase()] || networks.kmd
            ),
            coin: _coin[0].toLowerCase(),
          },
        };

        // console.warn('multisig', _multisigOut);

        this.setState({
          agamaMultisigTxOut: _multisigOut,
        });
      };

      if (this.state.creator) {
        apiElectrumListunspent(
          _coin[0],
          this.state.sendFrom
        )
        .then((utxos) => {
          if (utxos.msg === 'success') {
            _createtx(utxos);
          } else {
            Store.dispatch(
              triggerToaster(
                'Unable to get UTXOs',
                translate('TOOLS.ERR_OFFLINE_TX_SIG'),
                'error'
              )
            );
          }
        });
      } else {
        _createtx();
      }
    }
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

  renderSignatures() {
    const _sigs = this.state.agamaMultisigIncompleteTxParsed.sigs;
    let _items = [];

    for (let i = 0; i < _sigs.length; i++) {
      _items.push(
        <div
          key={ `tools-multisig-tx-sig-${i}` }
          className="padding-bottom-5">
          { _sigs[i] }
        </div>
      );
    }

    return _items;
  }

  render() {
    return (
      <div className="row margin-left-10">
        <div className="col-xlg-12 form-group form-material no-padding-left padding-bottom-10">
          <h4>Create/sign multi signature transaction</h4>
        </div>
        { this.state.creator &&
          <div className="col-xlg-12 form-group form-material no-padding-left padding-bottom-70">
            <label
              className="control-label col-sm-2 no-padding-left"
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
        }
        <div className="col-sm-12 form-group form-material no-padding-left">
          <label className="switch">
            <input
              type="checkbox"
              checked={ this.state.creator }
              readOnly />
            <div
              className="slider"
              onClick={ this.toggleCreator }></div>
          </label>
          <div
            className="toggle-label margin-right-15 pointer iguana-core-toggle"
            onClick={ this.toggleCreator }>
            I want to create transaction
          </div>
        </div>
        { /*!mainWindow.multisig &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
            <label className="switch">
              <input
                type="checkbox"
                checked={ this.state.agamaGeneratedAddress }
                readOnly />
              <div
                className="slider"
                onClick={ this.toggleAgamaGen }></div>
            </label>
            <div
              className="toggle-label margin-right-15 pointer iguana-core-toggle"
              disabled="true"
              onClick={ this.toggleAgamaGen }>
              I generated multisig address elsewhere (native daemon such as komodod or other wallet app)
            </div>
          </div>*/
        }
        { !this.state.agamaGeneratedAddress &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
            <textarea
              rows="5"
              cols="20"
              className="col-sm-7 blur"
              onChange={ this.updateInput }
              name="agamaMultisigData"
              placeholder="Provide Agama generated multi signature data here"
              value={ this.state.agamaMultisigData }></textarea>
          </div>
        }
        { !this.state.creator &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
            <textarea
              rows="5"
              cols="20"
              className="col-sm-7 blur"
              onChange={ this.updateInput }
              name="agamaMultisigIncompleteTx"
              placeholder="Provide Agama generated incomplete multi signature transaction data here"
              value={ this.state.agamaMultisigIncompleteTx }></textarea>
          </div>
        }
        <div className="col-sm-12 form-group form-material no-padding-left">
          <label
            className="control-label col-sm-2 no-padding-left"
            htmlFor="kmdWalletSendTo">
            Seed / WIF
          </label>
          <input
            type="text"
            className="form-control col-sm-3 blur"
            name="seed"
            onChange={ this.updateInput }
            value={ this.state.seed }
            id="kmdWalletSendTo"
            placeholder={ translate('TOOLS.ENTER_A_SEED') + ' or WIF' }
            disabled={ mainWindow.multisig && mainWindow.multisig.signKey }
            autoComplete="off"
            required />
        </div>
        { this.state.creator &&
          <div>
            <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
              <label
                className="control-label col-sm-2 no-padding-left"
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
                placeholder={ !this.state.agamaGeneratedAddress ? 'Click on Get balance button below' : translate('SEND.ENTER_ADDRESS') }
                autoComplete="off"
                disabled={ !this.state.agamaGeneratedAddress }
                required />
            </div>
            <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
              <button
                type="button"
                className="btn btn-info col-sm-2"
                onClick={ this.getBalance }
                disabled={ !this.state.selectedCoin }>
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
                className="control-label col-sm-2 no-padding-left"
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
                className="control-label col-sm-2 no-padding-left"
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
          </div>
        }
        { !this.state.creator &&
          !this.state.agamaMultisigIncompleteTxParsed &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
            <button
              type="button"
              className="btn btn-primary col-sm-2"
              onClick={ this.verifyTx }
              disabled={
                !this.state.agamaMultisigIncompleteTx
              }>
              Verify transaction
            </button>
          </div>
        }
        { !this.state.creator &&
          this.state.agamaMultisigIncompleteTxParsed &&
          this.state.agamaMultisigIncompleteTxParsed.inputData &&
          <div className="col-sm-12 form-group form-material no-padding-left padding-top-5 no-margin-bottom">
            <h5>Transaction details</h5>
            <table className="table table-hover dataTable table-striped">
              <tbody>
                <tr>
                  <td>
                    <strong>From</strong>
                  </td>
                  <td>
                    { this.state.agamaMultisigIncompleteTxParsed.inputData.from }
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>To</strong>
                  </td>
                  <td>
                    { this.state.agamaMultisigIncompleteTxParsed.inputData.outputAddress }
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Amount</strong>
                  </td>
                  <td>
                    { fromSats(this.state.agamaMultisigIncompleteTxParsed.inputData.value) }
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Fee</strong>
                  </td>
                  <td>
                    { fromSats(this.state.agamaMultisigIncompleteTxParsed.inputData.fee) }
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Change</strong>
                  </td>
                  <td>
                    { fromSats(this.state.agamaMultisigIncompleteTxParsed.inputData.change) } to { this.state.agamaMultisigIncompleteTxParsed.inputData.changeAddress }
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Signatures</strong>
                  </td>
                  <td>
                    { this.renderSignatures() }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
        { (this.state.creator || this.state.agamaMultisigIncompleteTxParsed) &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
            <button
              type="button"
              className="btn btn-primary col-sm-2"
              onClick={ this.getUnsignedTx }
              disabled={
                (this.state.creator &&
                (!this.state.balance ||
                !this.state.sendFrom ||
                !this.state.sendTo ||
                !this.state.selectedCoin ||
                !this.state.amount)) ||
                (!this.state.creator && (!this.state.agamaMultisigData || !this.state.agamaMultisigIncompleteTx))
              }>
              { this.state.creator ? 'Generate transaction' : 'Sign transaction' }
            </button>
            { this.state.agamaMultisigTxOut &&
              this.state.agamaMultisigTxOut.sigs &&
              this.state.agamaMultisigTxOut.sigs.length === Number(this.state.agamaMultisigTxOut.multisigData.nOfN.split('-')[0]) &&
              <button
                type="button"
                className="btn btn-primary col-sm-2 margin-left-25"
                onClick={ this.pushTx }>
                Push transaction
              </button>
            }
          </div>
        }
        { this.state.agamaMultisigTxOut &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
            <div>
              <strong>Multi signature transaction data</strong>
            </div>
            <div className="padding-top-10 padding-bottom-10">
              <strong>Signatures: { this.state.agamaMultisigTxOut.sigs.length } of { this.state.agamaMultisigTxOut.multisigData.nOfN.split('-')[0] } </strong>
            </div>
            <div className="word-break--all blur selectable">
              { JSON.stringify(this.state.agamaMultisigTxOut) }
              <button
                className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                onClick={ this.copyTxData }>
                <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
              </button>
            </div>
          </div>
        }
        { this.state.txPushResult &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-20">
            { this.state.txPushResult.length === 64 &&
              <div>
                <div className="margin-bottom-15">
                  { this.state.selectedCoin.split('|')[0].toUpperCase() } { translate('TOOLS.TX_PUSHED') }!
                </div>
                <div>
                  TXID: <div className="blur selectable word-break--all">{ this.state.txPushResult }</div>
                  <div className="margin-top-10">
                    <button
                      type="button"
                      className="btn btn-sm white btn-dark waves-effect waves-light pull-left"
                      onClick={ () => this.openExplorerWindow(this.state.txPushResult) }>
                      <i className="icon fa-external-link"></i> { translate('INDEX.OPEN_TRANSACTION_IN_EPLORER', this.state.selectedCoin.split('|')[0].toUpperCase()) }
                    </button>
                  </div>
                </div>
              </div>
            }
            { this.state.txPushResult.length !== 64 &&
              <div>
                <strong>{ translate('TOOLS.ERROR') }:</strong>
                <div className="selectable word-break--all">{ JSON.stringify(this.state.txPushResult) }</div>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default ToolsMultisigTx;