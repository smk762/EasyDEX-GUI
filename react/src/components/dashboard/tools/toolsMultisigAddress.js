import React from 'react';
import translate from '../../../translate/translate';
import addCoinOptionsCrypto from '../../addcoin/addcoinOptionsCrypto';
import addCoinOptionsAC from '../../addcoin/addcoinOptionsAC';
import Select from 'react-select';
import {
  triggerToaster,
  apiToolsBalance,
  apiToolsBuildUnsigned,
  apiToolsPushTx,
  apiToolsSeedToWif,
  apiToolsWifToKP,
  apiElectrumListunspent,
  apiCliPromise,
  apiElectrumSplitUtxoPromise,
  copyString,
} from '../../../actions/actionCreators';
import Store from '../../../store';

import { msigAddress } from 'agama-wallet-lib/src/keys';
import networks from 'agama-wallet-lib/src/bitcoinjs-networks';

class ToolsMultisigAddress extends React.Component {
  constructor() {
    super();
    this.state = {
      nOfN: '1-2',
      pubHex: null,
      coin: '',
      msigData: null,
    };
    this.updateInput = this.updateInput.bind(this);
    this.updateSelectedCoin = this.updateSelectedCoin.bind(this);
    this.generateMsigAddress = this.generateMsigAddress.bind(this);
  }

  _copyString(type) {
    const _msg = {
      'redeemScript': 'Redeem script',
      'scriptPubKey': 'Sript pub key',
      'address': 'Address',
      'agama': 'Agama multi signature data',
    };
    Store.dispatch(copyString(this.state.msigData[type], _msg[type] + ' is copied'));
  }

  generateMsigAddress() {
    const _coin = this.state.coin.split('|');
    const _pubKeys = this.state.pubHex.split('\n');
    const _requiredSigs = this.state.nOfN.split('-');

    if (_pubKeys.length < _requiredSigs[1]) {
      Store.dispatch(
        triggerToaster(
          'Not enough pub keys provided',
          'Multi signature address',
          'error'
        )
      );
    } else {
      try {
        let _msigAddress = msigAddress(
          Number(_requiredSigs[0]),
          _pubKeys,
          networks[_coin[0].toLowerCase()] || networks.kmd
        );

        const _agama = JSON.stringify(_msigAddress);
        _msigAddress.agama = _agama;

        this.setState({
          msigData: _msigAddress,
        });
      } catch (e) {
        console.warn(e);
        Store.dispatch(
          triggerToaster(
            'Unable to generate multi signature address. Check if all provided data is correct.',
            'Multi signature address',
            'error'
          )
        );
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

  render() {
    return (
      <div className="row margin-left-10">
        <div className="col-xlg-12 form-group form-material no-padding-left padding-bottom-10">
          <h4>Multi signature address generation</h4>
        </div>
        <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
          <label
            className="control-label col-sm-2 no-padding-left"
            htmlFor="kmdWalletSendTo">
            Number of signatures
          </label>
          <select
            name="nOfN"
            className="col-sm-3 margin-top-20"
            value={ this.state.nOfN }
            onChange={ this.updateInput }>
            <option value="1-2">1 of 2</option>
            <option value="2-2">2 of 2</option>
            <option value="2-3">2 of 3</option>
            <option value="3-5">3 of 5</option>
          </select>
        </div>
        <div className="col-xlg-12 form-group form-material no-padding-left padding-top-20 padding-bottom-70">
          <label
            className="control-label col-sm-2 no-padding-left"
            htmlFor="kmdWalletSendTo">
            { translate('TOOLS.COIN') }
          </label>
          <Select
            name="w2wCoin"
            className="col-sm-3"
            value={ this.state.coin }
            onChange={ (event) => this.updateSelectedCoin(event, 'coin') }
            optionRenderer={ this.renderCoinOption }
            valueRenderer={ this.renderCoinOption }
            options={
              addCoinOptionsCrypto('skip', true)
              .concat(addCoinOptionsAC('skip'))
            } />
        </div>
        <div className="col-sm-12 form-group form-material no-padding-left">
          <label
            className="control-label col-sm-2 no-padding-left"
            htmlFor="kmdWalletSendTo">
            Pub keys
          </label>
          <textarea
            rows="5"
            cols="20"
            name="pubHex"
            className="col-sm-7 no-padding-left"
            placeholder={ `Provide ${this.state.nOfN.split('-')[1]} pub keys (hex). Place each key hex is on a new line.` }
            onChange={ this.updateInput }
            value={ this.state.pubHex }></textarea>
        </div>
        <div className="col-sm-12 form-group form-material no-padding-left margin-top-10 padding-bottom-10">
          <button
            type="button"
            className="btn btn-info col-sm-2"
            disabled={
              !this.state.pubHex ||
              !this.state.coin
            }
            onClick={ this.generateMsigAddress }>
            Generate multi signature address
          </button>
        </div>
        { this.state.msigData &&
          <div className="col-sm-12 form-group form-material no-padding-left margin-top-10">
            <div>
              <strong>Address:</strong> <span className="blur selectable">{ this.state.msigData.address }</span>
              <button
                className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                onClick={ () => this._copyString('address') }>
                <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
              </button>
            </div>
            <div className="margin-top-25">
              <strong>Redeem script:</strong> <span className="blur selectable word-break--all">{ this.state.msigData.redeemScript }</span>
              <button
                className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                onClick={ () => this._copyString('redeemScript') }>
                <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
              </button>
            </div>
            <div className="margin-top-25">
              <strong>Script pub key:</strong> <span className="blur selectable">{ this.state.msigData.scriptPubKey }</span>
              <button
                className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                onClick={ () => this._copyString('scriptPubKey') }>
                <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
              </button>
            </div>
            <div className="margin-top-25">
              <strong>Use the following info to create multi signature transactions in Agama:</strong>
              <div className="blur selectable word-break--all">
                { this.state.msigData.agama }
                <button
                  className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                  title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                  onClick={ () => this._copyString('agama') }>
                  <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default ToolsMultisigAddress;