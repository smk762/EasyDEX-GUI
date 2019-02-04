import React from 'react';
import translate from '../../../translate/translate';
import Config from '../../../config';

const ExchangesTOSModalRender = function() {
  return (
    <div onKeyDown={ (event) => this.handleKeydown(event) }>
      <div
        className={ `modal modal-3d-sign exchanges-tos-modal ${this.state.className}` }
        id="kmd_txid_info_mdl">
        <div
          onClick={ this.close }
          className="modal-close-overlay"></div>
        <div className="modal-dialog modal-center modal-lg">
          <div
            onClick={ this.close }
            className="modal-close-overlay"></div>
          <div className="modal-content">
            <div className="modal-header bg-orange-a400 wallet-send-header">
              <button
                type="button"
                className="close white"
                onClick={ this.close }>
                <span>×</span>
              </button>
              <h4 className="modal-title white">
                Exchange Terms of Service
              </h4>
            </div>
            <div className="modal-body modal-body-container">
              <p>If you continue you agee to use a 3rd party service Coinswitch.co. All your actions with the use of Coinswitch.co API are outside of Komodo Platform control and are subject to Coinswitch.co <a onClick={ this.openCoinswitchTOS } className="pointer">terms of service</a>. Komodo Platform will not disclose any private information to Coinswitch.co. All details that you may provide to Coinswitch.co will be subject to Coinswitch.co <a onClick={ this.openCoinswitchTOS } className="pointer">terms for service</a>.</p>
              <p>KOMODO PLATFORM ACCEPTS NO RESPONSIBILITY AND WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE WHATSOEVER SUFFERED AS A RESULT OF ACCESSING, USE OF, OR RELIANCE UPON COINSWITCH.CO INFORMATION AND SERVICES.</p>
            </div>
          </div>
        </div>
      </div>
      <div className={ `modal-backdrop ${this.state.className}` }></div>
    </div>
  );
};

export default ExchangesTOSModalRender;