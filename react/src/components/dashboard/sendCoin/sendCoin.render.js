import React from 'react';
import { translate } from '../../../translate/translate';
import QRModal from '../qrModal/qrModal';

export const AddressListRender = function() {
  return (
    <div className={ `btn-group bootstrap-select form-control form-material showkmdwalletaddrs show-tick ${(this.state.addressSelectorOpen ? 'open' : '')}` }>
      <button
        type="button"
        className={ 'btn dropdown-toggle btn-info' + (this.props.ActiveCoin.mode === 'spv' ? ' disabled' : '') }
        onClick={ this.openDropMenu }>
        <span className="filter-option pull-left">{ this.renderSelectorCurrentLabel() } </span>
        <span className="bs-caret">
          <span className="caret"></span>
        </span>
      </button>
      <div className="dropdown-menu open">
        <ul className="dropdown-menu inner">
          <li
            className="selected"
            onClick={ () => this.updateAddressSelection(null, 'public', null) }>
            <a>
              <span className="text">{ this.props.ActiveCoin.mode === 'spv' ? `[ ${this.props.ActiveCoin.balance.balance} ${this.props.ActiveCoin.coin} ] ${this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub}` : translate('INDEX.T_FUNDS') }</span>
              <span
                className="glyphicon glyphicon-ok check-mark pull-right"
                style={{ display: this.state.sendFrom === null ? 'inline-block' : 'none' }}></span>
            </a>
          </li>
          { this.renderAddressByType('public') }
          { this.renderAddressByType('private') }
        </ul>
      </div>
    </div>
  );
};

export const _SendFormRender = function() {
  return (
    <form
      className="extcoin-send-form"
      method="post"
      autoComplete="off">
      { this.state.renderAddressDropdown &&
        <div className="row">
          <div className="col-xlg-12 form-group form-material">
            <label className="control-label padding-bottom-10">{ translate('INDEX.SEND_FROM') }</label>
            { this.renderAddressList() }
          </div>
        </div>
      }
      <div className="row">
        <div className="col-xlg-12 form-group form-material">
          <label
            className="control-label"
            htmlFor="kmdWalletSendTo">{ translate('INDEX.SEND_TO') }</label>
          <input
            type="text"
            className="form-control"
            name="sendTo"
            onChange={ this.updateInput }
            value={ this.state.sendTo }
            id="kmdWalletSendTo"
            placeholder={ this.props.ActiveCoin.coin === 'CHIPS' ? translate('SEND.ENTER_ADDRESS') : translate('SEND.ENTER_T_OR_Z_ADDR') }
            autoComplete="off"
            required />
        </div>
        <div className="col-lg-12 form-group form-material">
          <label
            className="control-label"
            htmlFor="kmdWalletAmount">
            { translate('INDEX.AMOUNT') }
          </label>
          <input
            type="text"
            className="form-control"
            name="amount"
            value={ this.state.amount !== 0 ? this.state.amount : '' }
            onChange={ this.updateInput }
            id="kmdWalletAmount"
            placeholder="0.000"
            autoComplete="off" />
        </div>
        <div className={ 'col-lg-6 form-group form-material' + (this.isTransparentTx() && this.props.ActiveCoin.mode === 'native' ? '' : ' hide') }>
          <span className="pointer">
            <label className="switch">
              <input
                type="checkbox"
                checked={ this.state.subtractFee } />
              <div
                className="slider"
                onClick={ () => this.toggleSubtractFee() }></div>
            </label>
            <div
              className="toggle-label"
              onClick={ () => this.toggleSubtractFee() }>
                { translate('DASHBOARD.SUBTRACT_FEE') }
            </div>
          </span>
        </div>
        <div className="col-lg-6 form-group form-material hide">
          <label
            className="control-label"
            htmlFor="kmdWalletFee">
            { translate('INDEX.FEE') }
          </label>
          <input
            type="text"
            className="form-control"
            name="fee"
            onChange={ this.updateInput }
            id="kmdWalletFee"
            placeholder="0.000"
            value={ this.state.fee !== 0 ? this.state.fee : '' }
            autoComplete="off" />
        </div>
        <div className="col-lg-12 hide">
          <span>
            <strong>{ translate('INDEX.TOTAL') }:</strong>&nbsp;
            { this.state.amount } - { this.state.fee }/kb = { Number(this.state.amount) - Number(this.state.fee) }&nbsp;
            { this.props.ActiveCoin.coin }
          </span>
        </div>
        { !this.isFullySynced() &&
          this.props.ActiveCoin &&
          this.props.ActiveCoin.mode === 'native' &&
          <div className="col-lg-12 padding-top-20 padding-bottom-20 send-coin-sync-warning">
            <i className="icon fa-warning color-warning margin-right-5"></i> <span className="desc">{ translate('SEND.SEND_NATIVE_SYNC_WARNING') }</span>
          </div>
        }
        <div className="col-lg-12">
          <button
            type="button"
            className="btn btn-primary waves-effect waves-light pull-right"
            onClick={ this.props.renderFormOnly ? this.handleSubmit : () => this.changeSendCoinStep(1) }
            disabled={ !this.state.sendTo || !this.state.amount }>
            { translate('INDEX.SEND') } { this.state.amount } { this.props.ActiveCoin.coin }
          </button>
        </div>
      </div>
    </form>
  );
}

export const SendRender = function() {
  if (this.props.renderFormOnly) {
    return (
      <div>{ this.SendFormRender() }</div>
    );
  } else {
    return (
      <div className="col-sm-12 padding-top-10">
        <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="steps row margin-top-10">
            <div className={ 'step col-md-4' + (this.state.currentStep === 0 ? ' current' : '') }>
              <span className="step-number">1</span>
              <div className="step-desc">
                <span className="step-title">{ translate('INDEX.FILL_SEND_FORM') }</span>
                <p>{ translate('INDEX.FILL_SEND_DETAILS') }</p>
              </div>
            </div>
            <div className={ 'step col-md-4' + (this.state.currentStep === 1 ? ' current' : '') }>
              <span className="step-number">2</span>
              <div className="step-desc">
                <span className="step-title">{ translate('INDEX.CONFIRMING') }</span>
                <p>{ translate('INDEX.CONFIRM_DETAILS') }</p>
              </div>
            </div>
            <div className={ 'step col-md-4' + (this.state.currentStep === 2 ? ' current' : '') }>
              <span className="step-number">3</span>
              <div className="step-desc">
                <span className="step-title">{ translate('INDEX.PROCESSING_TX') }</span>
                <p>{ translate('INDEX.PROCESSING_DETAILS') }</p>
              </div>
            </div>
          </div>
        </div>

        <div className={ 'col-xlg-12 col-md-12 col-sm-12 col-xs-12' + (this.state.currentStep === 0 ? '' : ' hide') }>
          <div className="panel">
            <div className="panel-heading">
              <h3 className="panel-title">
                { translate('INDEX.SEND') } { this.props.ActiveCoin.coin }
              </h3>
            </div>
            <div className="qr-modal-send-block">
              <QRModal
                mode="scan"
                setRecieverFromScan={ this.setRecieverFromScan } />
            </div>
            <div className="panel-body container-fluid">
            { this.SendFormRender() }
            </div>
          </div>
        </div>

        <div className={ 'col-xlg-12 col-md-12 col-sm-12 col-xs-12' + (this.state.currentStep === 1 ? '' : ' hide') }>
          <div className="panel">
            <div className="panel-body">
              <div className="row">
                <div className="col-xs-12">
                  <strong>{ translate('INDEX.TO') }</strong>
                </div>
                <div
                  className="col-lg-6 col-sm-6 col-xs-12"
                  style={{ overflow: 'hidden' }}>{ this.state.sendTo }</div>
                <div className="col-lg-6 col-sm-6 col-xs-6">
                  { this.state.amount } { this.props.ActiveCoin.coin }
                </div>
                <div className={ this.state.subtractFee ? 'col-lg-6 col-sm-6 col-xs-12 padding-top-10 bold' : 'hide' }>{ translate('DASHBOARD.SUBTRACT_FEE') }</div>
              </div>

              { this.state.sendFrom &&
                <div className="row padding-top-20">
                  <div className="col-xs-12">
                    <strong>{ translate('INDEX.FROM') }</strong>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 col-xs-12"
                    style={{ overflow: 'hidden' }}>{ this.state.sendFrom }</div>
                  <div className="col-lg-6 col-sm-6 col-xs-6 confirm-currency-send-container">
                    { Number(this.state.amount) } { this.props.ActiveCoin.coin }
                  </div>
                </div>
              }
              { this.state.spvPreflightSendInProgress &&
                <div className="padding-top-20">{ translate('SEND.SPV_VERIFYING') }...</div>
              }
              { this.state.spvVerificationWarning &&
                <div
                  className="padding-top-20"
                  style={{ fontSize: '15px' }}>
                  <strong className="color-warning">{ translate('SEND.WARNING') }:</strong> { translate('SEND.WARNING_SPV_P1') }<br />
                  { translate('SEND.WARNING_SPV_P2') }
                </div>
              }
              <div className="widget-body-footer">
                <a
                  className="btn btn-default waves-effect waves-light"
                  onClick={ () => this.changeSendCoinStep(0, true) }>{ translate('INDEX.BACK') }</a>
                <div className="widget-actions pull-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={ () => this.changeSendCoinStep(2) }>
                      { translate('INDEX.CONFIRM') }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={ 'col-xlg-12 col-md-12 col-sm-12 col-xs-12' + (this.state.currentStep === 2 ? '' : ' hide') }>
          <div className="panel">
            <div className="panel-heading">
              <h4 className="panel-title">
                { translate('INDEX.TRANSACTION_RESULT') }
              </h4>
              <div>
                { this.state.lastSendToResponse &&
                  !this.state.lastSendToResponse.msg &&
                  <table className="table table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="padding-left-30">{ translate('INDEX.KEY') }</th>
                        <th className="padding-left-30">{ translate('INDEX.INFO') }</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="padding-left-30">
                        { translate('SEND.RESULT') }
                        </td>
                        <td className="padding-left-30">
                          <span className="label label-success">{ translate('SEND.SUCCESS_SM') }</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="padding-left-30">{ translate('SEND.TRANSACTION_ID') }</td>
                        <td className="padding-left-30">{ this.props.ActiveCoin.mode === 'spv' ? (this.state.lastSendToResponse && this.state.lastSendToResponse.txid ? this.state.lastSendToResponse.txid : '') : this.state.lastSendToResponse }</td>
                      </tr>
                    </tbody>
                  </table>
                }
                { !this.state.lastSendToResponse &&
                  <div className="padding-left-30 padding-top-10">{ translate('SEND.PROCESSING_TX') }...</div>
                }
                { this.state.lastSendToResponse &&
                  this.state.lastSendToResponse.msg &&
                  this.state.lastSendToResponse.msg === 'error' &&
                  <div className="padding-left-30 padding-top-10">
                    <div>
                      <strong>{ translate('API.ERROR_SM') }</strong>
                    </div>
                    <div>{ this.state.lastSendToResponse.result }</div>
                  </div>
                }
              </div>
              <div className="widget-body-footer">
                <div className="widget-actions margin-bottom-15 margin-right-15">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={ () => this.changeSendCoinStep(0) }>
                      { translate('INDEX.MAKE_ANOTHER_TX') }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        { this.renderOPIDListCheck() &&
          <div className="col-xs-12">
            <div className="row">
              <div className="panel nav-tabs-horizontal">
                <div>
                  <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
                    <div className="panel">
                      <header className="panel-heading">
                        <h3 className="panel-title">
                          { translate('INDEX.OPERATIONS_STATUSES') }
                        </h3>
                      </header>
                      <div className="panel-body">
                        <table
                          className="table table-hover dataTable table-striped"
                          width="100%">
                          <thead>
                            <tr>
                              <th>{ translate('INDEX.STATUS') }</th>
                              <th>ID</th>
                              <th>{ translate('INDEX.TIME') }</th>
                              <th>{ translate('INDEX.RESULT') }</th>
                            </tr>
                          </thead>
                          <tbody>
                            { this.renderOPIDList() }
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>{ translate('INDEX.STATUS') }</th>
                              <th>ID</th>
                              <th>{ translate('INDEX.TIME') }</th>
                              <th>{ translate('INDEX.RESULT') }</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
};