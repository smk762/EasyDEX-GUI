import React from 'react';
import { translate } from '../../../translate/translate';

/*export const _ClaimInterestTableRender = function() {
};*/

export const ImportKeyModalRender = function() {
  return (
    <span>
      <div className={ 'modal modal-import-key modal-3d-sign ' + (this.props.Dashboard.displayImportKeyModal ? 'show in' : 'fade hide') }>
        <div className="modal-dialog modal-center modal-sm">
          <div className="modal-content">
            <div className="modal-header bg-orange-a400 wallet-send-header">
              <button
                type="button"
                className="close white"
                onClick={ this.closeModal }>
                <span>×</span>
              </button>
              <h4 className="modal-title white text-left">Import key</h4>
            </div>
            <div className="modal-body">
              <div className="padding-bottom-40">
                Two forms below allow you to import either <strong>Iguana Core / ICO</strong> passphrase (seed) or <strong>WIF (Wallet Import Format)</strong> key.
              </div>
              <div>
                <strong>Passphrase / seed</strong>
                <p className="margin-top-10">
                  <strong>Notice:</strong> importing a passphrase will trigger a full wallet rescan.&nbsp;
                  <span className={ this.props.ActiveCoin.coin === 'KMD' ? '' : 'hide' }>This process can take hours to rescan the whole blockchain.</span>
                </p>
                <form
                  className="wifkeys-form"
                  method="post"
                  action="javascript:"
                  autoComplete="off">
                  <div className="form-group form-material floating">
                    <input
                      type="password"
                      className={ !this.state.seedInputVisibility ? 'form-control' : 'hide' }
                      name="wifkeysPassphrase"
                      id="wifkeysPassphrase"
                      onChange={ this.updateInput }
                      value={ this.state.wifkeysPassphrase } />
                    <textarea
                      className={ this.state.seedInputVisibility ? 'form-control' : 'hide' }
                      id="wifkeysPassphraseTextarea"
                      name="wifkeysPassphrase"
                      onChange={ this.updateInput }
                      value={ this.state.wifkeysPassphrase }></textarea>
                    <i
                      className={ 'seed-toggle fa fa-eye' + (!this.state.seedInputVisibility ? '-slash' : '') }
                      onClick={ this.toggleSeedInputVisibility }></i>
                    <label
                      className="floating-label"
                      htmlFor="wifkeysPassphrase">{ translate('INDEX.PASSPHRASE') }</label>
                  </div>
                  <div className="text-align-center">
                    <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light margin-right-20"
                      onClick={ this.importFromPassphrase }>Import</button>
                    <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light"
                      onClick={ this.showPassphraseAddress }>Show address and WIF</button>
                  </div>
                </form>
                { this.state.passphraseAddress && this.state.passphraseWif &&
                  <div className="margin-top-60">
                    <p>
                      <strong>Address: </strong> { this.state.passphraseAddress }
                      <button
                        className="btn btn-default btn-xs clipboard-edexaddr copy-string-btn"
                        title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                        onClick={ () => this._copyCoinAddress(this.state.passphraseAddress) }>
                          <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                      </button>
                    </p>
                    <p>
                      <strong>WIF: </strong> { this.state.passphraseWif }
                      <button
                        className="btn btn-default btn-xs clipboard-edexaddr copy-string-btn"
                        title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                        onClick={ () => this._copyCoinAddress(this.state.passphraseWif) }>
                          <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                      </button>
                    </p>
                  </div>
                }
              </div>
              <div className="line">or</div>
              <div>
                <strong>WIF (Wallet Import Format)</strong>
                <div className="toggle-box padding-top-20">
                  <span className="pointer">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={ this.state.importWithRescan } />
                      <div
                        className="slider"
                        onClick={ this.toggleImportWithRescan }></div>
                    </label>
                    <div
                      className="toggle-label"
                      onClick={ this.toggleImportWithRescan }>
                        Trigger rescan
                        <i
                          className="icon fa-question-circle settings-help"
                          title="Use this option if you want to trigger rescan after WIF is imported. If you have several addresses that you want to import add them one by one and toggle this option on the last address import."></i>
                    </div>
                  </span>
                </div>
                <div className="margin-top-20">
                  <label htmlFor="wif" className="bold">Wif key</label>
                  <input
                    type="text"
                    className="form-control"
                    name="wif"
                    onChange={ this.updateInput }
                    value={ this.state.wif } />
                </div>
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light margin-top-10"
                  onClick={ this.importFromWif }>{ this.state.importWithRescan ? 'Import and rescan' : 'Import' }</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ 'modal-backdrop ' + (this.props.Dashboard.displayImportKeyModal ? 'show in' : 'fade hide') }></div>
    </span>
  );
};