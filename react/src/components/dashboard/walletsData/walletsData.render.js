import React from 'react';
import { translate } from '../../../translate/translate';
import WalletsBasiliskRefresh from '../walletsBasiliskRefresh/walletsBasiliskRefresh';
import WalletsBasiliskConnection from '../walletsBasiliskConnection/walletsBasiliskConnection';
import WalletsNotariesList from '../walletsNotariesList/walletsNotariesList';
import WalletsCacheData from '../walletsCacheData/walletsCacheData';
import ReactTable from 'react-table';
import TablePaginationRenderer from './pagination';

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

export const AddressItemRender = function(address, type, amount, coin) {
  return (
    <li key={address}>
      <a onClick={ () => this.updateAddressSelection(address, type, amount) }>
        <i className={ 'icon fa-eye' + (type === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
        <span className="text">[ { amount } { coin } ]  { address }</span>
        <span className="glyphicon glyphicon-ok check-mark"></span>
      </a>
    </li>
  );
};

export const AddressListRender = function() {
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
};

export const TxHistoryListRender = function() {
  return (
    <ReactTable
      data={this.state.itemsList}
      columns={this.state.itemsListColumns}
      sortable={true}
      filterable={true}
      className='-striped -highlight'
      PaginationComponent={TablePaginationRenderer}
      nextText={translate('INDEX.NEXT_PAGE')}
      previousText={translate('INDEX.PREVIOUS_PAGE')}
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
        <div className="col-xs-12 margin-top-20">
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
                          className={ 'dropdown' + (this.state.basiliskActionsMenu ? ' open' : '') }
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
                    <div className="row">
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