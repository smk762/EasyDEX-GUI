import React from 'react';
import { translate } from '../../../translate/translate';

const CoindDownModalRender = function () {
  return (
    <div>
      <div
        className={ 'modal modal-3d-sign coind-down-modal ' + (this.state.display ? 'show in' : 'fade hide') }
        id="AddCoinDilogModel-login">
        <div className="modal-dialog modal-center modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-orange-a400 wallet-send-header">
              <button
                type="button"
                className="close white"
                onClick={ this.dismiss }>
                <span>×</span>
              </button>
              <h4 className="modal-title white">{ this.props.ActiveCoin.coin === 'KMD' ? 'Komodod' : `Komodod / ${this.props.ActiveCoin.coin}` } is down!</h4>
            </div>
            <div className="modal-body">
              <div className="vertical-align text-center">
                <div className="page-content vertical-align-middle">
                  <strong>Debug.log (last 50 lines)</strong>
                  <div className="form-group form-material floating">
                    <textarea
                      className="form-control"
                      value={ this.props.Settings.debugLog }></textarea>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    id="loginbtn"
                    onClick={ this.dismiss }>OK</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ 'modal-backdrop ' + (this.state.display ? 'show in' : 'fade hide') }></div>
    </div>
  );
};

export default CoindDownModalRender;