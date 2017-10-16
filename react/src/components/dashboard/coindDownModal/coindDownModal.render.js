import React from 'react';
import { translate } from '../../../translate/translate';

const CoindDownModalRender = function() {
  let _debuglog = this.props.debugLog || '';

  if (_debuglog.indexOf('ENOENT') > -1) {
    _debuglog = 'Error: ' + (this.props.ActiveCoin.coin === 'KMD' ? 'Komodod' : `Komodod / ${this.props.ActiveCoin.coin}`) + ' debug.log is empty. Looks like daemon didn\'t start properly. Please retry.';
  }

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
              <h4 className="modal-title white">{ this.props.ActiveCoin.coin === 'KMD' ? 'Komodod' : `Komodod / ${this.props.ActiveCoin.coin}` } { translate('INDEX.IS_DOWN') }!</h4>
            </div>
            <div className="modal-body">
              <div className="vertical-align text-center">
                <div className="page-content vertical-align-middle">
                  <strong>Debug.log ({ translate('INDEX.LAST_50_LINES') })</strong>
                  <div className="form-group form-material floating">
                    <textarea
                      readOnly
                      className="form-control"
                      value={ _debuglog }></textarea>
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