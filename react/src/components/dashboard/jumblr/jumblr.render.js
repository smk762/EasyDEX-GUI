import React from 'react';
import { translate } from '../../../translate/translate';

import WalletsHeader from '../walletsHeader/walletsHeader';
import WalletsNativeSend from '../walletsNativeSend/walletsNativeSend';
import ReceiveCoin from '../receiveCoin/receiveCoin';

export const JumblrRenderSecretAddressList = function(type) {
  const _jumblrAddressList = type === 'gen' ? this.state.jumblrSecretAddress : this.state.jumblrSecretAddressImport;
  let _items = [];

  if (_jumblrAddressList &&
      _jumblrAddressList.length) {
    for (let i = 0; i < _jumblrAddressList.length; i++) {
      _items.push(
        <tr key={ `jumblr-secret-address-${i}` }>
          <td>{ _jumblrAddressList[i].address }</td>
          <td>{ _jumblrAddressList[i].wif }</td>
        </tr>
      );
    }
    return _items;
  } else {
    return null;
  }
};

/* passphrase toggle
  <div className={ 'toggle-box padding-top-20 padding-bottom-' + (this.state.jumblrDepositAddressPBased ? '10' : '30') }>
    <span className="pointer">
      <label className="switch">
        <input
          type="checkbox"
          checked={ this.state.jumblrDepositAddressPBased } />
        <div
          className="slider"
          onClick={ () => this.toggleAddressGenMod() }></div>
      </label>
      <div
        className="toggle-label"
        onClick={ () => this.toggleAddressGenMod() }>
          Passphrase based address
      </div>
    </span>
  </div>
*/

export const JumblrRender = function() {
  return (
    <div className="page margin-left-0 jumblr">
      <WalletsHeader activeSection="jumblr" />
      <div className="page-content margin-top-30">
        <div className="row">
          <div className="col-xs-12">
            <div className="alert alert-danger">
              <button
                type="button"
                className="close">
                <span>×</span>
              </button>
              <span className="jumblr-header">
                <i className="icon fa-paw"></i> { translate('JUMBLR.NOTICE') }
              </span>
              <br />
              { translate('JUMBLR.DESCRIPTION') }
            </div>
          </div>

          <div className="col-xs-12">
            <div className="alert alert-info alert-dismissible">
              <button
                type="button"
                className="close">
                <span>×</span>
              </button>
              <span className="jumblr-header">
                <i className="icon fa-paw"></i> About Jumblr
              </span>
              <br />
              <p>
                Jumblr functions all locally which means no middle man is required to jumble your funds. You take control over the whole process.
              </p>
              <p>
                <strong>Tip:</strong> to achive maximum anonimity setup Jumblr node on a dedicated piece of hardware (laptop or VPS), use a separate IP address for main Jumblr node.
              </p>
            </div>
          </div>

          <div className="col-xlg-12 col-md-12 padding-top-20 padding-bottom-30">
            <div
              className="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2"
              style={{ padding: 0 }}>
              <input
                type="radio"
                className="to-labelauty labelauty"
                name={ `mode-public` }
                id={ `mode-public` }
                checked={ this.state.jumblrMode === 'public' ? true : false } />
              <label
                htmlFor={ `mode-public` }
                style={{ margin: 0 }}
                onClick={ () => this.switchJumblrMode('public') }>
                <span
                  className="labelauty-unchecked-image"
                  style={{ display: this.state.jumblrMode === 'public' ? 'none' : 'inline-block' }}></span>
                <span
                  className="labelauty-unchecked"
                  style={{ display: this.state.jumblrMode === 'public' ? 'none' : 'inline-block' }}>
                    Public node
                </span>
                <span
                  className="labelauty-checked-image"
                  style={{ display: this.state.jumblrMode === 'public' ? 'inline-block' : 'none' }}></span>
                <span
                  className="labelauty-checked"
                  style={{ display: this.state.jumblrMode === 'public' ? 'inline-block' : 'none' }}>
                    Public node
                </span>
              </label>
            </div>

            <div
              className="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2"
              style={{ padding: 0 }}>
              <input
                type="radio"
                className="to-labelauty labelauty"
                name={ `mode-private` }
                id={ `mode-private` }
                checked={ this.state.jumblrMode === 'private' ? true : false } />
              <label
                htmlFor={ `mode-private` }
                style={{ margin: 0 }}
                onClick={ () => this.switchJumblrMode('private') }>
                <span
                  className="labelauty-unchecked-image"
                  style={{ display: this.state.jumblrMode === 'private' ? 'none' : 'inline-block' }}></span>
                <span
                  className="labelauty-unchecked"
                  style={{ display: this.state.jumblrMode === 'private' ? 'none' : 'inline-block' }}>
                    Private node
                </span>
                <span
                  className="labelauty-checked-image"
                  style={{ display: this.state.jumblrMode === 'private' ? 'inline-block' : 'none' }}></span>
                <span
                  className="labelauty-checked"
                  style={{ display: this.state.jumblrMode === 'private' ? 'inline-block' : 'none' }}>
                    Private node
                </span>
              </label>
            </div>
          </div>

          <div className="col-xlg-12 col-md-12">
            { this.state.jumblrMode === 'public' &&
              <div className="jumblr-mode-selector nav-tabs-horizontal nav-tabs-inverse">
                <div className="img-responsive">
                  <span className="coin">{ this.props.ActiveCoin.coin }</span>
                  <img
                    className="image"
                    src={ `assets/images/cryptologo/${this.props.ActiveCoin.coin.toLowerCase()}.png` }
                    alt={ this.props.ActiveCoin.coin }/>
                </div>
                <ul className="nav nav-tabs">
                  <li
                    className={ this.state.activeTab === 0 ? 'active' : '' }
                    onClick={ () => this.openTab(0) }>
                    <a>
                      { translate('JUMBLR.USING_JUMBLR') }
                    </a>
                  </li>
                  <li
                    className={ this.state.activeTab === 1 ? 'active' : '' }
                    onClick={ () => this.openTab(1) }>
                    <a>
                      Deposit address
                    </a>
                  </li>
                  <li
                    className={ this.state.activeTab === 2 ? 'active' : '' }
                    onClick={ () => this.openTab(2) }>
                    <a>
                      Secret address
                    </a>
                  </li>
                  <li
                    className={ this.state.activeTab === 3 ? 'active' : '' }
                    onClick={ () => this.openTab(3) }>
                    <a>
                      Deposit funds
                    </a>
                  </li>
                </ul>
                <div className="tab-content padding-20">
                  <div className={ 'tab-pane' + (this.state.activeTab === 0 ? ' active' : '') }>
                    <button
                      type="button"
                      className="btn btn-success waves-effect waves-light margin-top-20 btn-next"
                      onClick={ () => this.openTab(1) }>Next</button>
                    <h5>How to use Jumblr</h5>
                    <ul>
                      <li>Create deposit address</li>
                      <li>Create secret address</li>
                      <li>Send funds to deposit address</li>
                      <li>{ translate('JUMBLR.KEEP_WALLET_OPEN') }</li>
                      <li>{ translate('JUMBLR.IMPORTANT_FUNDS') }</li>
                      <li>{ translate('JUMBLR.LARGE_LOT') }</li>
                    </ul>
                    <p>{ this.renderLB('JUMBLR.EG') }</p>
                    <p>{ translate('JUMBLR.93_KMD') }</p>
                    <p>{ translate('JUMBLR.TO_CLEAR_THEM') }</p>
                    <p>{ translate('JUMBLR.WHEN_IT_TOTALS') }</p>
                  </div>
                  <div className={ 'tab-pane' + (this.state.activeTab === 1 ? ' active' : '') }>
                    <button
                      type="button"
                      className="btn btn-success waves-effect waves-light btn-next"
                      onClick={ () => this.openTab(2) }>Next</button>
                    <h5>{ translate('JUMBLR.FEW_SECURITY_NOTES') }</h5>
                    <div className="col-xs-12 nofloat">
                      <ul className="padding-bottom-20">
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC1') }</li>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC2') }</li>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC3') }</li>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC4') }</li>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC5') }</li>
                      </ul>
                    </div>
                    { this.state.jumblrDepositAddressPBased &&
                      <div className="padding-bottom-30">
                        <div className="padding-bottom-20">
                          <p>
                            <strong>Please write down your Jumblr passphrase and keept it safe.</strong>
                          </p>
                          <p>This is your main recovery passphrase.</p>
                          <p>All Jumblr addresses can be regenrated based on it.</p>
                          <p>
                            <strong>Tip:</strong> do not use smart editors to store your passphrase as they tend to add extra characters.<br />This may result in passphrase mismatch with the original passphrase.
                          </p>
                        </div>
                        <label>Passphrase</label>
                        <input
                          type="text"
                          className="form-control"
                          name="loginPassphrase"
                          onChange={ this.returnPassphrase }
                          value={ this.state.randomSeed } />
                        <button
                          className="btn btn-default btn-xs clipboard-edexaddr copy-string-btn"
                          title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                          onClick={ () => this.copyPassphrase() }>
                            <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                        </button>
                      </div>
                    }
                    <button
                      type="button"
                      className="btn btn-info waves-effect waves-light"
                      onClick={ this.generateJumblrDepositAddress }>Create Jumblr deposit address</button>
                    { this.state.jumblrDepositAddress && this.state.jumblrDepositAddress.address &&
                      <div className="padding-top-40">
                        <strong>Your Jumblr deposit address:</strong>
                        <p>
                          { this.state.jumblrDepositAddress.address }
                          <button
                            className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                            title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                            onClick={ () => this._copyCoinAddress(this.state.jumblrDepositAddress.address) }>
                              <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                          </button>
                        </p>
                        <p>
                          { this.state.jumblrDepositAddress.wif }
                          <button
                            className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                            title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                            onClick={ () => this._copyCoinAddress(this.state.jumblrDepositAddress.wif) }>
                              <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                          </button>
                        </p>
                      </div>
                    }
                  </div>
                  <div className={ 'tab-pane' + (this.state.activeTab === 2 ? ' active' : '') }>
                    <button
                      type="button"
                      className="btn btn-success waves-effect waves-light margin-top-20 btn-next"
                      onClick={ () => this.openTab(3) }>Next</button>
                    <p>Jumblr secret addresses are used for the final z -> t transactions.</p>
                    <p>In order to allow larger accounts to obtain privacy, up to 777 secret addresses are supported.</p>
                    <p>Whenever a z -> t stage is activated, a random secret address from the list of the then active secret addresses is selected.</p>
                    <p>To add a new set of secret addresses enter address count below. The passphrase below is exactly the same you saw on the previous step.</p>
                    <p>Your Jumblr secret address recovery passphrase will have the following pattern <code>jumblr muffin smart educate tomato boss foil open dirt opinion pizza goddess skate action card garden cotton life write life note shine myself gloom summer XXX</code>. Where XXX any number from 001 to 777.</p>

                    { this.state.jumblrDepositAddressPBased &&
                      <div className="padding-bottom-20 padding-top-20">
                        <label>Passphrase</label>
                        <input
                          type="text"
                          className="form-control"
                          name="jumblrPassphrase"
                          onChange={ this.returnPassphrase }
                          value={ this.state.randomSeed } />
                        <button
                          className="btn btn-default btn-xs clipboard-edexaddr copy-string-btn"
                          title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                          onClick={ () => this.copyPassphrase() }>
                            <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                        </button>
                      </div>
                    }
                    <div className="col-xs-2 nofloat padding-top-30">Number of secret addresses</div>
                    <div className="col-xs-2 nofloat padding-left-10">
                      <input
                        type="text"
                        pattern="[0-9]*"
                        className="form-control"
                        name="secretAddressCount"
                        min="1"
                        max="777"
                        onChange={ this.onChange }
                        value={ this.state.secretAddressCount } />
                    </div>
                    <div className="col-xs-2 nofloat">
                      <button
                        type="button"
                        className="btn btn-info waves-effect waves-light"
                        onClick={ this.generateJumblrSecretAddress }>Create Jumblr secret address(es)</button>
                    </div>
                    <div className="toggle-box padding-top-20">
                      <span className="pointer">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={ this.state.jumblrSecretAddressShow } />
                          <div
                            className="slider"
                            onClick={ () => this.toggle('jumblrSecretAddressShow') }></div>
                        </label>
                        <div
                          className="toggle-label"
                          onClick={ () => this.toggle('jumblrSecretAddressShow') }>
                            Show address list
                        </div>
                      </span>
                    </div>
                    <div className="col-xlg-12 col-md-12 padding-top-20 nofloat">
                      { this.state.jumblrSecretAddressShow && this.checkJumblrSecretAddressListLength('gen') &&
                        <table className="table table-hover dataTable table-striped">
                          <thead>
                            <tr>
                              <td>
                                <strong>Address</strong>
                              </td>
                              <td>
                                <strong>Wif</strong>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                          { this._JumblrRenderSecretAddressList('gen') }
                          </tbody>
                        </table>
                      }
                    </div>
                  </div>
                  <div className={ 'tab-pane' + (this.state.activeTab === 3 ? ' active' : '') }>
                    <p>Use the form below to send funds to your jumblr deposit address.</p>
                    <p className="padding-bottom-20">You can also send funds to deposit address from an external service or another wallet.</p>
                    <WalletsNativeSend
                      renderFormOnly="true"
                      activeSection="send" />
                  </div>
                </div>
              </div>
            }
            { this.state.jumblrMode === 'private' &&
              <div className="jumblr-mode-selector nav-tabs-horizontal nav-tabs-inverse">
                <ul className="nav nav-tabs">
                  <li
                    className={ this.state.activeTab === 0 ? 'active' : '' }
                    onClick={ () => this.openTab(0) }>
                    <a>
                      Import secret address
                    </a>
                  </li>
                  <li
                    className={ this.state.activeTab === 1 ? 'active' : '' }
                    onClick={ () => this.openTab(1) }>
                    <a>
                      Check funds
                    </a>
                  </li>
                </ul>
                <div className="tab-content padding-20">
                  <div className={ 'tab-pane' + (this.state.activeTab === 0 ? ' active' : '') }>
                    <button
                      type="button"
                      className="btn btn-success waves-effect waves-light margin-top-20 btn-next"
                      onClick={ () => this.openTab(1) }>Next</button>
                    <div className="col-xlg-12 col-md-12 nofloat">
                      <p>Enter your Jumblr passphrase you got previously during Public node configuration to import secret address.</p>
                      <p>Passphrase example: <code>jumblr muffin smart educate tomato boss foil open dirt opinion pizza goddess skate action card garden cotton life write life note shine myself gloom summer</code>.</p>
                      <p>The form below will "regenerate" Jumblr secret address based on passphrase provided.</p>
                      <p>After this final step expect to see funds processed and credited to your address after 2 days period.</p>

                      { this.state.jumblrDepositAddressPBased &&
                        <div className="padding-bottom-20 padding-top-20">
                          <label>Passphrase</label>
                          <input
                            type="text"
                            className="form-control"
                            name="jumblrPassphraseImport"
                            onChange={ (event) => this.passphraseOnChange(event) }
                            value={ this.state.jumblrPassphraseImport } />
                        </div>
                      }
                      <div className="col-xs-2 nofloat padding-top-30">Number of secret addresses</div>
                      <div className="col-xs-2 nofloat padding-left-10">
                        <input
                          type="text"
                          pattern="[0-9]*"
                          className="form-control"
                          name="secretAddressCountImport"
                          min="1"
                          max="777"
                          onChange={ this.onChange }
                          value={ this.state.secretAddressCountImport } />
                      </div>
                      <div className="col-xs-2 nofloat">
                        <button
                          type="button"
                          className="btn btn-info waves-effect waves-light"
                          onClick={ this.importJumblrSecretAddress }>Import Jumblr secret address(es)</button>
                      </div>
                      <div className="toggle-box padding-top-20">
                        <span className="pointer">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={ this.state.jumblrSecretAddressShowImport } />
                            <div
                              className="slider"
                              onClick={ () => this.toggle('jumblrSecretAddressShowImport') }></div>
                          </label>
                          <div
                            className="toggle-label"
                            onClick={ () => this.toggle('jumblrSecretAddressShowImport') }>
                              Show address list
                          </div>
                        </span>
                      </div>
                      <div className="col-xlg-12 col-md-12 padding-top-20 nofloat">
                        { this.state.jumblrSecretAddressShowImport && this.checkJumblrSecretAddressListLength('import') &&
                          <table className="table table-hover dataTable table-striped">
                            <thead>
                              <tr>
                                <td>
                                  <strong>Address</strong>
                                </td>
                                <td>
                                  <strong>Wif</strong>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                            { this._JumblrRenderSecretAddressList('import') }
                            </tbody>
                          </table>
                        }
                      </div>
                    </div>
                  </div>
                  <div className={ 'tab-pane' + (this.state.activeTab === 1 ? ' active' : '') }>
                    <ReceiveCoin
                      activeSection="receive"
                      renderTableOnly="true" />
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumblrRender;