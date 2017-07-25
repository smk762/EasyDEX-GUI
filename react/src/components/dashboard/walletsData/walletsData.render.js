import React from 'react';
import { translate } from '../../../translate/translate';
import WalletsBasiliskRefresh from '../walletsBasiliskRefresh/walletsBasiliskRefresh';
import WalletsBasiliskConnection from '../walletsBasiliskConnection/walletsBasiliskConnection';
import WalletsNotariesList from '../walletsNotariesList/walletsNotariesList';
import WalletsCacheData from '../walletsCacheData/walletsCacheData';
import { secondsToString } from '../../../util/time';

// TODO: clean basilisk dropdown menu

export const PaginationItemRender = function(i) {
  return (
    <li
      key={ `${i}-pagination-link` }
      className={ 'paginate_button' + (this.state.activePage === i + 1 ? ' active' : '') }>
      <a
        key={ `${i}-pagination` }
        onClick={ this.state.activePage !== (i + 1) ? () => this.updateCurrentPage(i + 1) : null }>{ i + 1 }</a>
    </li>
  );
};

export const PaginationItemsPerPageSelectorRender = function() {
  return (
    <div className="dataTables_length">
      <label>
        { translate('INDEX.SHOW') }&nbsp;
        <select
          name="itemsPerPage"
          className="form-control input-sm"
          onChange={ this.updateInput }>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>&nbsp;
        { translate('INDEX.ENTRIES_SM') }
      </label>
    </div>
  );
};

export const PaginationRender = function(paginationFrom, paginationTo) {
  const disableNextBtn = this.state.activePage >= Math.floor(this.props.ActiveCoin.txhistory.length / this.state.itemsPerPage);

  return (
    <div className="row unselectable">
      <div className="col-sm-5">
        <div className="dataTables_info">
          { translate('INDEX.SHOWING') }&nbsp;
          { paginationFrom }&nbsp;
          { translate('INDEX.TO_ALT') }&nbsp;
          { paginationTo }&nbsp;
          { translate('INDEX.OF') }&nbsp;
          { this.props.ActiveCoin.txhistory.length }&nbsp;
          { translate('INDEX.ENTRIES_SM') }
        </div>
      </div>
      <div className="col-sm-7">
        <div className="dataTables_paginate paging_simple_numbers">
          <ul className="pagination">
            <li className={ 'paginate_button previous' + (this.state.activePage === 1 ? ' disabled' : '') }>
              <a onClick={ () => this.updateCurrentPage(this.state.activePage - 1) }>{ translate('INDEX.PREVIOUS') }</a>
            </li>
            { this.renderPaginationItems() }
            <li className={ 'paginate_button next' + (disableNextBtn ? ' disabled' : '') }>
              <a onClick={ () => this.updateCurrentPage(this.state.activePage + 1) }>{ translate('INDEX.NEXT') }</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const TxHistoryListRender = function(tx, index) {
  return (
    <tr key={ tx.txid + tx.amount }>
      { this.isNativeMode() ?
          <td>
            <span className="label label-default">
              <i className="icon fa-eye"></i> { translate('IAPI.PUBLIC_SM') }
            </span>
          </td>
        :
        null
      }
      <td>{ this.renderTxType(tx.category || tx.type) }</td>
      <td>{ tx.confirmations }</td>
      <td>{ tx.amount || translate('DASHBOARD.UNKNOWN') }</td>
      <td>{ secondsToString(tx.blocktime || tx.timestamp || tx.time) }</td>
      <td className={ this.isFullMode() ? '' : 'hide' }>{ tx.address }</td>
      <td className={ this.isNativeMode() ? '' : 'hide' }>{ this.renderAddress(tx) }</td>
      <td className={ this.isBasiliskMode() ? 'text-center' : '' }>
        <button
          type="button"
          className="btn btn-xs white btn-info waves-effect waves-light btn-kmdtxid"
          onClick={ () => this.toggleTxInfoModal(!this.props.ActiveCoin.showTransactionInfo, ((this.state.activePage - 1) * this.state.itemsPerPage) + index) }>
          <i className="icon fa-search"></i>
        </button>
      </td>
    </tr>
  );
};

export const AddressListRender = function() {
  const isMultiPublicAddress = this.props.ActiveCoin.addresses && this.props.ActiveCoin.addresses.public && this.props.ActiveCoin.addresses.public.length > 1;
  const isMultiPrivateAddress = this.props.ActiveCoin.addresses && this.props.ActiveCoin.addresses.private && this.props.ActiveCoin.addresses.private.length > 1;

  if (isMultiPublicAddress ||
      isMultiPrivateAddress) {
    return (
      <div className={ `btn-group bootstrap-select form-control form-material showkmdwalletaddrs show-tick ${(this.state.addressSelectorOpen ? 'open' : '')}` }>
        <button
          type="button"
          className="btn dropdown-toggle btn-info"
          title={ `-${translate('KMD_NATIVE.SELECT_ADDRESS')}-` }
          onClick={ this.openDropMenu }>
          <span className="filter-option pull-left">{ this.renderSelectorCurrentLabel() } </span>&nbsp;
          <span className="bs-caret">
            <span className="caret"></span>
          </span>
        </button>
        <div className="dropdown-menu open">
          <ul className="dropdown-menu inner">
            <li className="selected">
              <a><span className="text"> - { translate('KMD_NATIVE.SELECT_ADDRESS') } - </span><span className="glyphicon glyphicon-ok check-mark"></span></a>
            </li>
            { this.renderAddressByType('public') }
          </ul>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export const WalletsDataRender = function() {
  return (
    <span>
      <WalletsBasiliskRefresh {...this.props} />
      <WalletsBasiliskConnection {...this.props} />
      <WalletsNotariesList {...this.props} />
      <WalletsCacheData {...this.props} />
      <div id="edexcoin_dashboardinfo">
        <div className="col-xs-12 margin-top-20 backround-gray">
          <div className="panel nav-tabs-horizontal">
            <div>
              <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
                <div className="panel">
                  <header className="panel-heading z-index-10">
                    <div className={ 'panel-actions' + (this.props.ActiveCoin.mode === 'basilisk' ? '' : ' hide') }>
                      <div className={ 'margin-bottom-3 ' + (this.state.currentStackLength === 1 || (this.state.currentStackLength === 0 && this.state.totalStackLength === 0) ? 'hide' : 'progress progress-sm') }>
                        <div
                          className="progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success font-size-80-percent"
                          style={{ width: 100 - (this.state.currentStackLength * 100 / this.state.totalStackLength) + '%' }}>
                          { translate('SEND.PROCESSING_REQ') }: { this.state.currentStackLength } / { this.state.totalStackLength }
                        </div>
                      </div>
                      { !this.isNativeMode() ?
                        <div
                          className={ 'dropdown basilisk-actions' + (this.state.basiliskActionsMenu ? ' open' : '') }
                          onClick={ this.toggleBasiliskActionsMenu }>
                          <a className="dropdown-toggle btn-xs btn-default">
                            <i className="icon fa-magic margin-right-10"></i> { translate('INDEX.BASILISK_ACTIONS') }
                            <span className="caret"></span>
                          </a>
                          <ul className="dropdown-menu dropdown-menu-right">
                            <li>
                              <a onClick={ this.getDexNotariesAction }>
                                <i className="icon fa-sitemap"></i> { translate('INDEX.GET_NOTARY_NODES_LIST') }
                              </a>
                            </li>
                            <li>
                              <a onClick={ this.basiliskConnectionAction }>
                                <i className="icon wb-refresh"></i> { translate('INDEX.REFRESH_BASILISK_CONNECTIONS') }
                              </a>
                            </li>
                            <li className={ !this.state.useCache ? 'hide' : '' }>
                              <a onClick={ this.basiliskRefreshActionOne }>
                                <i className="icon fa-cloud-download"></i> { translate('INDEX.FETCH_WALLET_DATA') }
                                ({ translate('INDEX.ACTIVE_ADDRESS') })
                              </a>
                            </li>
                            <li className={ !this.state.useCache || this.props.ActiveCoin.addresses
                            && this.props.ActiveCoin.addresses.public.length === 1 ? 'hide' : '' }>
                              <a onClick={ this.basiliskRefreshAction }>
                                <i className="icon fa-cloud-download"></i> { translate('INDEX.FETCH_ALL_ADDR') }
                              </a>
                            </li>
                            <li className={ !this.state.useCache ? 'hide' : '' }>
                              <a onClick={ this.removeAndFetchNewCache }>
                                <i className="icon fa-history"></i> { translate('INDEX.REFETCH_WALLET_DATA') }
                              </a>
                            </li>
                            <li className={ 'hide ' + (!this.state.useCache ? 'hide' : '') }>
                              <a onClick={ this.restartBasiliskInstance }>
                                <i className="icon fa-refresh"></i> Restart Basilisk Instance (unsafe!)
                              </a>
                            </li>
                            <li className={ !this.state.useCache ? 'hide' : '' }>
                              <a onClick={ this._toggleViewCacheModal }>
                                <i className="icon fa-list-alt"></i> { translate('INDEX.VIEW_CACHE_DATA') }
                              </a>
                            </li>
                          </ul>
                        </div>
                        :
                        null
                      }
                    </div>
                    <h4 className="panel-title">{ translate('INDEX.TRANSACTION_HISTORY') }</h4>
                  </header>
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-sm-8">
                        { this.renderAddressList() }
                      </div>
                    </div>
                    <div className="row pagination-container">
                      <div className="col-sm-6">
                        { this.renderPaginationItemsPerPageSelector() }
                      </div>
                      <div className="col-sm-6">
                        <div className="dataTables_filter">
                          <label>
                            { translate('INDEX.SEARCH') }: <input type="search" className="form-control input-sm" disabled="true" />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <table
                        className="table table-hover dataTable table-striped"
                        width="100%">
                        <thead>
                          <tr>
                            { this.isNativeMode() ?
                              <th>{ translate('INDEX.TYPE') }</th>
                              :
                              null
                            }
                            <th>{ translate('INDEX.DIRECTION') }</th>
                            <th className="hidden-xs hidden-sm">{ translate('INDEX.CONFIRMATIONS') }</th>
                            <th>{ translate('INDEX.AMOUNT') }</th>
                            <th>{ translate('INDEX.TIME') }</th>
                            <th className={ this.isBasiliskMode() ? 'hide' : '' }>{ translate('INDEX.DEST_ADDRESS') }</th>
                            <th className={ this.isBasiliskMode() ? 'hidden-xs hidden-sm text-center' : 'hidden-xs hidden-sm' }>{ translate('INDEX.TX_DETAIL') }</th>
                          </tr>
                        </thead>
                        <tbody>
                          { this.renderTxHistoryList() }
                        </tbody>
                        <tfoot>
                          <tr>
                             { this.isNativeMode() ?
                               <th>{ translate('INDEX.TYPE') }</th>
                               :
                               null
                             }
                            <th>{ translate('INDEX.DIRECTION') }</th>
                            <th>{ translate('INDEX.CONFIRMATIONS') }</th>
                            <th>{ translate('INDEX.AMOUNT') }</th>
                            <th>{ translate('INDEX.TIME') }</th>
                            <th className={ this.isBasiliskMode() ? 'hide' : '' }>{ translate('INDEX.DEST_ADDRESS') }</th>
                            <th className={ this.isBasiliskMode() ? 'hidden-xs hidden-sm text-center' : '' }>{ translate('INDEX.TX_DETAIL') }</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    { this.renderPagination() }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
  );
};