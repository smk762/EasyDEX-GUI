import React from 'react';
import translate from '../../../translate/translate';

const UserAgreementModalRender = function() {
  return (
    <div onKeyDown={ (event) => this.handleKeydown(event) }>
      <div
        className={ `modal modal-3d-sign user-agreement-modal ${this.state.className}` }
        id="kmd_txid_info_mdl">
        <div className="modal-close-overlay"></div>
        <div className="modal-dialog modal-center modal-lg">
          <div className="modal-close-overlay"></div>
          <div className="modal-content">
            <div className="modal-header bg-orange-a400 wallet-send-header">
              <h4 className="modal-title white">
                { translate('AGREEMENT.AGREEMENT_P1') }
              </h4>
            </div>
            <div className="modal-body modal-body-container">
              <p>{ translate('AGREEMENT.AGREEMENT_P2') }</p>
              <p>{ translate('AGREEMENT.AGREEMENT_P3') }</p>
              <p className="padding-bottom-20">{ translate('AGREEMENT.AGREEMENT_P4') }</p>
              <button
                onClick={ this.close }
                className="btn btn-md btn-primary btn-block ladda-button">
                { translate('AGREEMENT.AGREE') }
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={ `modal-backdrop ${this.state.className}` }></div>
    </div>
  );
};

export default UserAgreementModalRender;