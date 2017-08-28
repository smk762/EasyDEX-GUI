import React from 'react';
import { translate } from '../../../translate/translate';
import QRCode from 'qrcode.react';

export const InvoiceModalRender = function () {
  return (
    <span>
      <div
        className={ 'modal modal-3d-sign ' + (this.state.modalIsOpen ? 'show in' : 'fade hide') }
        id="QRModal">
        <div className="modal-dialog modal-center modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-orange-a400 wallet-send-header">
              <button
                type="button"
                className="close white"
                onClick={ this.closeModal }>
                <span>×</span>
              </button>
              <h4 className="modal-title white text-left">{ translate('INDEX.SCAN_QR_CODE') }</h4>
            </div>
            <div className="modal-body">
              <div className="animsition vertical-align fade-in">
                <div className="page-content">
                  <div className="row">
                    <div className="col-lg-8 form-group form-material vertical-align-middle">
                      <label
                      className="control-label"
                      htmlFor="edexcoinSendFrom">
                        { translate('INDEX.RECEIVE') }
                      </label>
                      { this.renderAddressList() }
                      <label
                      className="control-label margin-top-20"
                      htmlFor="edexcoinAmount">
                        { this.props.ActiveCoin.coin }
                      </label>
                      <input
                      type="number"
                      min="0"
                      className="form-control"
                      id="edexcoinAmount"
                      name="amount"
                      placeholder="0.001"
                      autoComplete="off"
                      value={ this.state.amount }
                      onChange={ this.updateInput } />
                    </div>
                    <div className="col-lg-4">
                      <QRCode
                        value={ this.state.content }
                        size={ 198 } />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ 'modal-backdrop ' + (this.state.modalIsOpen ? 'show in' : 'fade hide') }></div>
    </span>
  );
};

export const InvoiceModalButtonRender = function () {
  return (
    <span>
      <button type="button" 
        className="btn btn-success waves-effect waves-light margin-right-10"
        onClick={ this.openModal }>
          <i className="icon fa-file-text-o"></i>
          { translate('INDEX.CREATE_INVOICE') }
      </button>
    </span>
  );
};