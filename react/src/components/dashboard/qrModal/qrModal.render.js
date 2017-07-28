import React from 'react';
import { translate } from '../../../translate/translate';
import QRCode from 'qrcode.react';

export const QRModalRender = function () {
  return (
    <span>
      <span className="label label-default margin-left-10 action"
        title={ translate('INDEX.QRCODE') }
        onClick={this.openModal}>
        <i className="icon fa-qrcode" aria-hidden="true"></i>
      </span>
      <div
        className={ 'modal modal-3d-sign ' + (this.state.modalIsOpen ? 'show in' : 'fade hide') }
        id="QRModal"
        aria-hidden="true"
        aria-labelledby="QRModal"
        role="dialog"
        tabIndex="-1">
        <div className="modal-dialog modal-center modal-sm">
          <div className="modal-content">
            <div className="modal-header bg-orange-a400 wallet-send-header">
              <button
                type="button"
                className="close white"
                aria-label="Close"
                onClick={ this.closeModal }>
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title white text-left">{ translate('INDEX.SCAN_QR_CODE') }</h4>
            </div>
            <div className="modal-body">
              <div className="animsition vertical-align fade-in">
                <div className="page-content vertical-align-middle">
                  <QRCode 
                    value={this.props.content}
                    size={198}
                  />
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

export const QRModalReaderRender = function () {
  return (
    <span>
      <button type="button"
        className="btn btn-default"
        onClick={this.openModal}>
        <i className="icon fa-qrcode" aria-hidden="true"></i>
        { translate('INDEX.SCAN_QRCODE_WEBCAM') }
      </button>
      <div className={ 'modal modal-3d-sign ' + (this.state.modalIsOpen ? 'show in' : 'fade hide') }
        id="QRReadModal"
        aria-hidden="true"
        aria-labelledby="QRReadModal"
        role="dialog"
        tabIndex="-1">
          <div className="modal-dialog modal-center modal-md">
            <div className="modal-content">
              <div className="modal-header bg-orange-a400 wallet-send-header">
                <button
                  type="button"
                  className="close white"
                  aria-label="Close"
                  onClick={ this.closeModal }>
                  <span aria-hidden="true">×</span>
                </button>
                <h4 className="modal-title white text-left">{ translate('INDEX.SCAN_QRCODE_WEBCAM') }</h4>
              </div>
              <div className="modal-body">
                <div className="animsition vertical-align fade-in">
                  <div className="page-content vertical-align-middle">
                    <div id="webcam">
                      {this.state.error}
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