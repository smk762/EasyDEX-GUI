import React from 'react';
import { translate } from '../../../translate/translate';

const MIN_INTEREST_THRESHOLD = 0.001;

export const _ClaimInterestTableRender = function() {
  const _transactionsList = this.state.transactionsList;
  let _items = [];

  for (let i = 0; i < _transactionsList.length; i++) {
    if ((_transactionsList[i].interest === 0 && this.state.showZeroInterest) ||
        (_transactionsList[i].amount > 0 && _transactionsList[i].interest > 0)) {
      _items.push(
        <tr key={ `${_transactionsList[i].txid}${_transactionsList[i].address}` }>
          <td>
            <button
              className="btn btn-default btn-xs clipboard-edexaddr copy-string-btn"
              title={ translate('INDEX.COPY_TO_CLIPBOARD') }
              onClick={ () => this.copyTxId(_transactionsList[i].txid) }>
                <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
            </button>
          </td>
          <td>{ _transactionsList[i].address }</td>
          <td className={ _transactionsList[i].amount > 10 ? 'green bold' : '' }>{ _transactionsList[i].amount }</td>
          <td>{ _transactionsList[i].interest }</td>
          <td className="locktime center">
            { _transactionsList[i].locktime &&
              <i className="fa-check-circle green"></i>
            }
            { !_transactionsList[i].locktime &&
              <i className="fa-exclamation-circle red"></i>
            }
          </td>
        </tr>
      );
    }
  }

  return (
    <span>
      <div className="padding-bottom-20">
        <strong>{ translate('CLAIM_INTEREST.REQ_P1') }:</strong> { translate('CLAIM_INTEREST.REQ_P2') } <strong>10 KMD</strong>
      </div>
      <div className="text-left padding-top-10 padding-bottom-10">
        <label className="switch">
          <input
            type="checkbox"
            checked={ this.state.showZeroInterest } />
          <div
            className="slider"
            onClick={ this.toggleZeroInterest }></div>
        </label>
        <div
          className="toggle-label margin-right-15 pointer"
          onClick={ this.toggleZeroInterest }>
          Show zero interest
        </div>
      </div>
      <button
        type="button"
        className="btn btn-success waves-effect waves-light claim-btn"
        onClick={ () => this.claimInterest() }>
        <i className="icon fa-dollar"></i> { translate('CLAIM_INTEREST.CLAIM_INTEREST') }
      </button>
      <div className="table-scroll">
        <table className="table table-hover dataTable table-striped">
          <thead>
            <tr>
              <th></th>
              <th>{ translate('INDEX.ADDRESS') }</th>
              <th>{ translate('INDEX.AMOUNT') }</th>
              <th>{ translate('INDEX.Address') }</th>
              <th>Locktime</th>
            </tr>
          </thead>
          <tbody>
          { _items }
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>{ translate('INDEX.ADDRESS') }</th>
              <th>{ translate('INDEX.AMOUNT') }</th>
              <th>{ translate('INDEX.Address') }</th>
              <th>Locktime</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </span>
  );
};

export const ClaimInterestModalRender = function() {
  return (
    <span>
      <div className={ 'modal modal-claim-interest modal-3d-sign ' + (this.state.open ? 'show in' : 'fade hide') }>
        <div className="modal-dialog modal-center modal-sm">
          <div className="modal-content">
            <div className="modal-header bg-orange-a400 wallet-send-header">
              <button
                type="button"
                className="close white"
                onClick={ this.closeModal }>
                <span>×</span>
              </button>
              <h4 className="modal-title white text-left">{ translate('INDEX.CLAIM_INTEREST') }</h4>
            </div>
            <div className="modal-body">
              <i
                className="icon fa-refresh pointer refresh-icon"
                onClick={ this.loadListUnspent }></i>
              <div className="animsition vertical-align fade-in">
                <div className="page-content vertical-align-middle full-width">
                  { this.state.isLoading &&
                    <span>{ translate('INDEX.LOADING') }...</span>
                  }
                  { !this.state.isLoading && this.checkTransactionsListLength() &&
                    <div>{ this.claimInterestTableRender() }</div>
                  }
                  { !this.state.isLoading && !this.checkTransactionsListLength() &&
                    <div>{ translate('INDEX.NO_DATA') }</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ 'modal-backdrop ' + (this.state.open ? 'show in' : 'fade hide') }></div>
    </span>
  );
};