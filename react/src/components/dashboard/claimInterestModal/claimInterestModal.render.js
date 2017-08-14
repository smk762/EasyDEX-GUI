import React from 'react';
import { translate } from '../../../translate/translate';

const MIN_INTEREST_THRESHOLD = 0.001;

export const _ClaimInterestTableRender = function() {
  const _transactionsList = this.state.transactionsList;
  let _items = [];

  for (let i = 0; i < _transactionsList.length; i++) {
    if ((_transactionsList[i].interest === 0 && this.state.showZeroInterest) || (_transactionsList[i].amount > 0 && _transactionsList[i].interest > 0)) {
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
          <td>
            <button
              type="button"
              className={ 'btn btn-success waves-effect waves-light' + (_transactionsList[i].interest < MIN_INTEREST_THRESHOLD ? ' show' : '') }
              onClick={ () => this.claimInterest(_transactionsList[i].address, _transactionsList[i].amount) }>
              <i className="icon fa-dollar"></i> Claim
            </button>
          </td>
        </tr>
      );
    }
  }

  return (
    <span>
      <div className="padding-bottom-20">
        <strong>Requirements to accure interest:</strong> locktime field is set and amount is greater than 10 KMD
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
      <div className="table-scroll">
        <table className="table table-hover dataTable table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Address</th>
              <th>Amount</th>
              <th>Interest</th>
              <th>Locktime</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          { _items }
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>Address</th>
              <th>Amount</th>
              <th>Interest</th>
              <th>Locktime</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </span>
  );
};

          //{ this.renderAddressList('public') }
          //{ this.isNativeMode() && this.renderAddressList('private') }


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
              <h4 className="modal-title white text-left">Claim interest</h4>
            </div>
            <div className="modal-body">
              <i
                className="icon fa-refresh pointer refresh-icon"
                onClick={ this.loadListUnspent }></i>
              <div className="animsition vertical-align fade-in">
                <div className="page-content vertical-align-middle full-width">
                  { this.state.isLoading &&
                    <span>Loading interest data...</span>
                  }
                  { !this.state.isLoading && this.checkTransactionsListLength() &&
                    <div>{ this.claimInterestTableRender() }</div>
                  }
                  { !this.state.isLoading && !this.checkTransactionsListLength() &&
                    <div>No data</div>
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