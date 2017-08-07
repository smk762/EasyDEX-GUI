import React from 'react';
import { translate } from '../../../translate/translate';
import WalletsBasiliskRefresh from '../walletsBasiliskRefresh/walletsBasiliskRefresh';
import WalletsBasiliskConnection from '../walletsBasiliskConnection/walletsBasiliskConnection';
import WalletsNotariesList from '../walletsNotariesList/walletsNotariesList';
import WalletsCacheData from '../walletsCacheData/walletsCacheData';
import ReactTable from 'react-table';
import TablePaginationRenderer from './pagination';
import { formatValue } from '../../../util/formatValue';
import Config from '../../../config';

// TODO: clean basilisk dropdown menu

export const AddressTypeRender = function() {
  return (
    <td>
      <span className="label label-default">
        <i className="icon fa-eye"></i> { translate('IAPI.PUBLIC_SM') }
      </span>
    </td>
  );
};

export const TransactionDetailRender = function(transactionIndex) {
  return (
    <button
      type="button"
      className="btn btn-xs white btn-info waves-effect waves-light btn-kmdtxid"
      onClick={ () => this.toggleTxInfoModal(!this.props.ActiveCoin.showTransactionInfo, transactionIndex) }>
      <i className="icon fa-search"></i>
    </button>
  );
};

export const AddressRender = function(tx) {
  if (!tx.address) {
    return (
      <span>
        <i className="icon fa-bullseye"></i>
        <span className="label label-dark">
          { translate('DASHBOARD.ZADDR_NOT_LISTED') }
        </span>
      </span>
    );
  }

  return tx.address;
};

export const AddressItemRender = function(address, type, amount, coin) {
  return (
    <li key={address}
        className={ address === this.state.currentAddress ? 'selected' : '' }>
      <a onClick={ () => this.updateAddressSelection(address) }>
        <i className={ 'icon fa-eye' + (type === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
        <span className="text">[ { amount } { coin } ]  { address }</span>
        <span className="glyphicon glyphicon-ok check-mark"></span>
      </a>
    </li>
  );
};

export const AddressListRender = function() {
  const isMultiPublicAddress = this.props.ActiveCoin.addresses && this.props.ActiveCoin.addresses.public && this.props.ActiveCoin.addresses.public.length > 1;
  const isMultiPrivateAddress = this.props.ActiveCoin.addresses && this.props.ActiveCoin.addresses.private && this.props.ActiveCoin.addresses.private.length > 1;

  if (isMultiPublicAddress ||
      isMultiPrivateAddress) {
    return (
      <div className={ `btn-group bootstrap-select form-control form-material showkmdwalletaddrs show-tick ${(this.state.addressSelectorOpen ? 'open margin-bottom-10' : 'margin-bottom-10')}` }>
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
              <a><span className="text"> - { translate('KMD_NATIVE.SELECT_ADDRESS') } - </span></a>
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

export const TxTypeRender = function(category) {
  if (category === 'send' ||
    category === 'sent') {
    return (
      <span className="label label-danger">
          <i className="icon fa-arrow-circle-left"></i> <span>{ translate('DASHBOARD.OUT') }</span>
        </span>
    );
  }
  if (category === 'receive' ||
    category === 'received') {
    return (
      <span className="label label-success">
          <i className="icon fa-arrow-circle-right"></i> <span>{ translate('DASHBOARD.IN') }</span>
        </span>
    );
  }
  if (category === 'generate') {
    return (
      <span>
          <i className="icon fa-cogs"></i> <span>{ translate('DASHBOARD.MINED') }</span>
        </span>
    );
  }
  if (category === 'immature') {
    return (
      <span>
          <i className="icon fa-clock-o"></i> <span>{ translate('DASHBOARD.IMMATURE') }</span>
        </span>
    );
  }
  if (category === 'unknown') {
    return (
      <span>
          <i className="icon fa-meh-o"></i> <span>{ translate('DASHBOARD.UNKNOWN') }</span>
        </span>
    );
  }
};

export const TxAmountRender = function (tx) {
  if (Config.roundValues) {
    return (
      <td title={ tx.amount }>{ formatValue('round', tx.amount, -6) || translate('DASHBOARD.UNKNOWN') }</td>
    );
  }

  return (
    <td>{ tx.amount || translate('DASHBOARD.UNKNOWN') }</td>
  );
};

export const TxHistoryListRender = function() {
  return (
    <ReactTable
      data={this.state.filteredItemsList}
      columns={this.state.itemsListColumns}
      sortable={true}
      className='-striped -highlight'
      PaginationComponent={TablePaginationRenderer}
      nextText={translate('INDEX.NEXT_PAGE')}
      previousText={translate('INDEX.PREVIOUS_PAGE')}
      showPaginationBottom={this.state.showPagination}
      showPaginationTop={this.state.showPagination}
      pageSize={this.pageSize}
      onPageSizeChange={(pageSize, pageIndex) => this.onPageSizeChange(pageSize, pageIndex)}
    />
  );
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
                  <i
                    className="icon fa-refresh manual-txhistory-refresh pointer"
                    onClick={ this.refreshTxHistory }></i>
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
                            <li className="hide">
                              <a onClick={ this.getDexNotariesAction }>
                                <i className="icon fa-sitemap"></i> { translate('INDEX.GET_NOTARY_NODES_LIST') }
                              </a>
                            </li>
                            <li className="hide">
                              <a onClick={ this.basiliskConnectionAction }>
                                <i className="icon wb-refresh"></i> { translate('INDEX.REFRESH_BASILISK_CONNECTIONS') }
                              </a>
                            </li>
                            <li className={ !this.state.useCache ? 'hide' : '' }>
                              <a onClick={ this.basiliskRefreshActionOne }>
                                <i className="icon fa-cloud-download"></i> { translate('INDEX.FETCH_WALLET_DATA') }&nbsp;
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
                            <li className="hide">
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
                    <h4 className='panel-title'>{ translate('INDEX.TRANSACTION_HISTORY') }</h4>
                  </header>
                  <div className='panel-body'>
                    <div className='row padding-bottom-20'>
                      {this.shouldDisplayAddressList() &&
                        <div className='col-sm-8'>
                          {this.renderAddressList()}
                        </div>
                      }
                      <div className='col-sm-4'>
                        <input className="form-control"
                               onChange={e => this.onSearchTermChange(e.target.value)}
                               placeholder='Search' />
                      </div>
                    </div>
                    <div className='row'>
                      { this.renderTxHistoryList() }
                    </div>
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