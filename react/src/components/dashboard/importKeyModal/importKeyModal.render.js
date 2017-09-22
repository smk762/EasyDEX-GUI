import React from 'react';
import { translate } from '../../../translate/translate';

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
              <h4 className="modal-title white text-left">{ translate('IMPORT_KEY.IMPORT_KEY') }</h4>
            </div>
            <div className="modal-body">
              <div className="padding-bottom-40">
                { translate('IMPORT_KEY.TWO_FORMS_BELOW_P1') } <strong>Iguana Core / ICO</strong> { translate('IMPORT_KEY.TWO_FORMS_BELOW_P2') } <strong>WIF (Wallet Import Format)</strong> { translate('IMPORT_KEY.TWO_FORMS_BELOW_P3') }.
              </div>
              <div>
                <strong>{ translate('IMPORT_KEY.PASSPHRASE') }</strong>
                <p className="margin-top-10">
                  <strong>{ translate('IMPORT_KEY.NOTICE') }:</strong> { translate('IMPORT_KEY.NOTICE_DESC') }.&nbsp;
                  <span className={ this.props.ActiveCoin.coin === 'KMD' ? '' : 'hide' }>{ translate('IMPORT_KEY.KMD_RESCAN_WARNING_TIME') }.</span>
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
                      onClick={ this.importFromPassphrase }>{ translate('IMPORT_KEY.IMPORT') }</button>
                    <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light"
                      onClick={ this.showPassphraseAddress }>{ translate('IMPORT_KEY.SHOW_ADDRESS_AND_WIF') }</button>
                  </div>
                </form>
                { this.state.passphraseAddress && this.state.passphraseWif &&
                  <div className="margin-top-60">
                    <p>
                      <strong>{ translate('IMPORT_KEY.ADDRESS') }: </strong> { this.state.passphraseAddress }
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
              <div className="line">{ translate('IMPORT_KEY.OR') }</div>
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
                        { translate('IMPORT_KEY.TRIGGER_RESCAN') }
                        <i
                          className="icon fa-question-circle settings-help"
                          title={ translate('IMPORT_KEY.RESCAN_TIP') }></i>
                    </div>
                  </span>
                </div>
                <div className="margin-top-20">
                  <label
                    htmlFor="wif"
                    className="bold">{ translate('IMPORT_KEY.WIF_KEY') }</label>
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
                  onClick={ this.importFromWif }>{ this.state.importWithRescan ? translate('IMPORT_KEY.IMPORT_AND_RESCAN') : translate('IMPORT_KEY.IMPORT') }</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ 'modal-backdrop ' + (this.props.Dashboard.displayImportKeyModal ? 'show in' : 'fade hide') }></div>
    </span>
  );
};