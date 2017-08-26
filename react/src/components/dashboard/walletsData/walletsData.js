import React from 'react';
import { translate } from '../../../translate/translate';
import { sortByDate } from '../../../util/sort';
import { formatValue } from '../../../util/formatValue';
import Config from '../../../config';
import {
  basiliskRefresh,
  basiliskConnection,
  toggleDashboardTxInfoModal,
  getBasiliskTransactionsList,
  changeMainBasiliskAddress,
  displayNotariesModal,
  toggleViewCacheModal,
  changeActiveAddress,
  restartBasiliskInstance,
  connectNotaries,
  getDexNotaries,
  deleteCacheFile,
  fetchNewCacheData,
  fetchUtxoCache,
  getNativeTxHistory,
  getFullTransactionsList
} from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  AddressTypeRender,
  TransactionDetailRender,
  AddressRender,
  AddressItemRender,
  TxTypeRender,
  TxAmountRender,
  TxHistoryListRender,
  AddressListRender,
  WalletsDataRender
} from  './walletsData.render';
import { secondsToString } from '../../../util/time';

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

const socket = io.connect(`http://127.0.0.1:${Config.agamaPort}`);

class WalletsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basiliskActionsMenu: false,
      itemsList: [],
      filteredItemsList: [],
      currentAddress: null,
      addressSelectorOpen: false,
      currentStackLength: 0,
      totalStackLength: 0,
      useCache: true,
      itemsListColumns: this.generateItemsListColumns(),
      defaultPageSize: 10,
      pageSize: 10,
      showPagination: true,
      searchTerm: null,
      coin: null,
      txhistory: null,
    };

    this.toggleBasiliskActionsMenu = this.toggleBasiliskActionsMenu.bind(this);
    this.basiliskRefreshAction = this.basiliskRefreshAction.bind(this);
    this.basiliskConnectionAction = this.basiliskConnectionAction.bind(this);
    this.getDexNotariesAction = this.getDexNotariesAction.bind(this);
    this.openDropMenu = this.openDropMenu.bind(this);
    this.removeAndFetchNewCache = this.removeAndFetchNewCache.bind(this);
    this._toggleViewCacheModal = this._toggleViewCacheModal.bind(this);
    this.toggleCacheApi = this.toggleCacheApi.bind(this);
    this._fetchUtxoCache = this._fetchUtxoCache.bind(this);
    this.restartBasiliskInstance = this.restartBasiliskInstance.bind(this);
    this.basiliskRefreshActionOne = this.basiliskRefreshActionOne.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.refreshTxHistory = this.refreshTxHistory.bind(this);
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    setTimeout(() => {
      if (this.props.ActiveCoin.mode === 'basilisk' || (Object.keys(this.props.Main.coins.basilisk).length && (Object.keys(this.props.Main.coins.native).length || Object.keys(this.props.Main.coins.full).length)) || Object.keys(this.props.Main.coins.basilisk).length) {
        socket.on('messages', msg => this.updateSocketsData(msg));
      } else {
        socket.removeAllListeners('messages');
      }
    }, 100);
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    socket.removeAllListeners('messages');
  }

  // https://react-table.js.org/#/custom-sorting
  tableSorting(a, b) { // ugly workaround, override default sort
    if (Date.parse(a)) { // convert date to timestamp
      a = Date.parse(a);
    }
    if (Date.parse(b)) {
      b = Date.parse(b);
    }
    // force null and undefined to the bottom
    a = (a === null || a === undefined) ? -Infinity : a;
    b = (b === null || b === undefined) ? -Infinity : b;
    // force any string values to lowercase
    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b;
    // Return either 1 or -1 to indicate a sort priority
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
    return 0;
  }

  generateItemsListColumns() {
    let columns = [];

    if (this.isNativeMode()) {
      columns.push({
        Header: translate('INDEX.TYPE'),
        Footer: translate('INDEX.TYPE'),
        className: 'colum--type',
        headerClassName: 'colum--type',
        footerClassName: 'colum--type',
        Cell: AddressTypeRender(),
      });
    }

    columns.push(...[
    {
      id: 'direction',
      Header: translate('INDEX.DIRECTION'),
      Footer: translate('INDEX.DIRECTION'),
      className: 'colum--direction',
      headerClassName: 'colum--direction',
      footerClassName: 'colum--direction',
      accessor: (tx) => TxTypeRender.call(this, tx.category || tx.type),
    },
    {
      Header: translate('INDEX.CONFIRMATIONS'),
      Footer: translate('INDEX.CONFIRMATIONS'),
      headerClassName: 'hidden-xs hidden-sm',
      footerClassName: 'hidden-xs hidden-sm',
      className: 'hidden-xs hidden-sm',
      accessor: 'confirmations',
    },
    {
      id: 'amount',
      Header: translate('INDEX.AMOUNT'),
      Footer: translate('INDEX.AMOUNT'),
      accessor: (tx) => TxAmountRender.call(this, tx),
    },
    {
      id: 'timestamp',
      Header: translate('INDEX.TIME'),
      Footer: translate('INDEX.TIME'),
      accessor: (tx) => secondsToString(tx.blocktime || tx.timestamp || tx.time),
    }
    ]);

    if (this.isFullMode()) {
      columns.push({
        Header: translate('INDEX.DEST_ADDRESS'),
        Footer: translate('INDEX.DEST_ADDRESS'),
        accessor: 'address',
      });
    }

    if (this.isNativeMode()) {
      columns.push({
        id: 'destination-address',
        Header: translate('INDEX.DEST_ADDRESS'),
        Footer: translate('INDEX.DEST_ADDRESS'),
        accessor: (tx) => AddressRender.call(this, tx),
      });
    }

    // const txDetailColumnCssClasses = this.isBasiliskMode() ? 'hidden-xs hidden-sm' : 'hidden-xs hidden-sm';

    columns.push({
      id: 'tx-detail',
      Header: translate('INDEX.TX_DETAIL'),
      Footer: translate('INDEX.TX_DETAIL'),
      className: 'colum--txinfo',
      headerClassName: 'colum--txinfo',
      footerClassName: 'colum--txinfo',
      Cell: props => TransactionDetailRender.call(this, props.index),
    });

    return columns;
  }

  handleClickOutside(e) {
    if (e.srcElement.className !== 'btn dropdown-toggle btn-info' &&
        (e.srcElement.offsetParent && e.srcElement.offsetParent.className !== 'btn dropdown-toggle btn-info') &&
        (e.path && e.path[4] && e.path[4].className.indexOf('showkmdwalletaddrs') === -1) &&
        (e.srcElement.offsetParent && e.srcElement.offsetParent.className.indexOf('dropdown') === -1) &&
        e.srcElement.className !== 'dropdown-toggle btn-xs btn-default') {
      this.setState({
        addressSelectorOpen: false,
        basiliskActionsMenu: false,
      });
    }
  }

  // deprecated
  toggleCacheApi() {
    const _useCache = !this.state.useCache;

    sessionStorage.setItem('useCache', _useCache);
    this.setState(Object.assign({}, this.state, {
      useCache: _useCache,
    }));
  }

  restartBasiliskInstance() {
    Store.dispatch(restartBasiliskInstance());
  }

  _toggleViewCacheModal() {
    Store.dispatch(toggleViewCacheModal(!this.props.Dashboard.displayViewCacheModal));
  }

  updateSocketsData(data) {
    let stateObj = {};

    if (this.props.ActiveCoin.mode === 'basilisk') {
      if (data &&
          data.message &&
          data.message.shepherd.iguanaAPI &&
          data.message.shepherd.iguanaAPI.totalStackLength) {
        stateObj = Object.assign(stateObj, {
          totalStackLength: data.message.shepherd.iguanaAPI.totalStackLength,
        });
      }
      if (data &&
          data.message &&
          data.message.shepherd.iguanaAPI &&
          data.message.shepherd.iguanaAPI.currentStackLength) {
        stateObj = Object.assign(stateObj, {
          currentStackLength: data.message.shepherd.iguanaAPI.currentStackLength,
        });
      }
      if (data &&
          data.message &&
          data.message.shepherd.method &&
          data.message.shepherd.method === 'cache-one' &&
          data.message.shepherd.status === 'done') {
        Store.dispatch(basiliskRefresh(false));
      }

      if (Object.keys(stateObj).length) {
        this.setState(Object.assign({}, this.state, stateObj));
      }
    }
  }

  refreshTxHistory() {
    const _mode = this.props.ActiveCoin.mode;
    const _coin = this.props.ActiveCoin.coin;

    switch(_mode) {
      case 'basilisk':
        Store.dispatch(fetchNewCacheData({
          pubkey: this.props.Dashboard.activeHandle.pubkey,
          allcoins: false,
          coin: _coin,
          calls: 'listtransactions',
          skip: true,
          address: this.state.currentAddress,
        }));
        break;
      case 'native':
        Store.dispatch(getNativeTxHistory(_coin));
        break;
      case 'full':
        Store.dispatch(getFullTransactionsList(_coin));
        break;
    }
  }

  removeAndFetchNewCache() {
    Store.dispatch(deleteCacheFile({
      pubkey: this.props.Dashboard.activeHandle.pubkey,
      allcoins: false,
      coin: this.props.ActiveCoin.coin,
      calls: 'listtransactions:getbalance',
      address: this.state.currentAddress,
    }));
  }

  _fetchUtxoCache() {
    Store.dispatch(fetchUtxoCache({
      pubkey: this.props.Dashboard.activeHandle.pubkey,
      allcoins: false,
      coin: this.props.ActiveCoin.coin,
      calls: 'refresh',
      address: this.state.currentAddress,
    }));
  }

  toggleBasiliskActionsMenu() {
    this.setState(Object.assign({}, this.state, {
      basiliskActionsMenu: !this.state.basiliskActionsMenu,
    }));
  }

  basiliskRefreshAction() {
    Store.dispatch(fetchNewCacheData({
      pubkey: this.props.Dashboard.activeHandle.pubkey,
      allcoins: false,
      coin: this.props.ActiveCoin.coin,
      calls: 'listtransactions:getbalance',
    }));
  }

  basiliskRefreshActionOne() {
    Store.dispatch(fetchNewCacheData({
      pubkey: this.props.Dashboard.activeHandle.pubkey,
      allcoins: false,
      coin: this.props.ActiveCoin.coin,
      calls: 'listtransactions:getbalance',
      address: this.props.ActiveCoin.activeAddress,
    }));
  }

  basiliskConnectionAction() {
    if (this.props.Dashboard) {
      Store.dispatch(basiliskConnection(!this.props.Dashboard.basiliskConnection));
      Store.dispatch(connectNotaries());
    }
  }

  getDexNotariesAction() {
    Store.dispatch(getDexNotaries(this.props.ActiveCoin.coin));
    Store.dispatch(displayNotariesModal(true));
  }

  toggleTxInfoModal(display, txIndex) {
    Store.dispatch(toggleDashboardTxInfoModal(display, txIndex));
  }

  indexTxHistory(txhistoryArr) {
    if (txhistoryArr.length > 1) {
      for (let i = 0; i < txhistoryArr.length; i++) {
        this.props.ActiveCoin.txhistory[i].index = i + 1;
      }
    }

    return this.props.ActiveCoin.txhistory;
  }

  componentWillReceiveProps(props) {
    if (!this.state.currentAddress &&
      this.props.ActiveCoin.activeAddress &&
      this.props.ActiveCoin.mode === 'basilisk') {
      this.setState(Object.assign({}, this.state, {
        currentAddress: this.props.ActiveCoin.activeAddress,
      }));
    }

    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory !== 'loading' &&
        this.props.ActiveCoin.txhistory !== 'no data' &&
        this.props.ActiveCoin.txhistory.length) {
        if (!this.state.itemsList ||
            (this.state.coin && this.state.coin !== this.props.ActiveCoin.coin) ||
            (JSON.stringify(this.props.ActiveCoin.txhistory) !== JSON.stringify(this.state.txhistory))) {
          this.setState(Object.assign({}, this.state, {
            itemsList: this.props.ActiveCoin.txhistory,
            filteredItemsList: this.filterTransactions(this.props.ActiveCoin.txhistory, this.state.searchTerm),
            txhistory: this.props.ActiveCoin.txhistory,
            showPagination: this.props.ActiveCoin.txhistory && this.props.ActiveCoin.txhistory.length >= this.state.defaultPageSize,
          }));
      }
    }

    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory === 'no data') {
        this.setState(Object.assign({}, this.state, {
          itemsList: 'no data',
        }));
    } else if (this.props.ActiveCoin.txhistory && this.props.ActiveCoin.txhistory === 'loading') {
      this.setState(Object.assign({}, this.state, {
        itemsList: 'loading',
      }));
    }

    this.setState({
      itemsListColumns: this.generateItemsListColumns(),
    });
  }

  isFullySynced() {
    if (this.props.Dashboard.progress &&
        (Number(this.props.Dashboard.progress.balances) +
        Number(this.props.Dashboard.progress.validated) +
        Number(this.props.Dashboard.progress.bundles) +
        Number(this.props.Dashboard.progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
  }

  // TODO: add basilisk first run check, display no data if second run
  renderTxHistoryList() {
    if (this.state.itemsList === 'loading' ||
        this.state.itemsList.length == 0) {
      if (this.isFullySynced()) {
        return (
          <tr className="hover--none">
            <td colSpan="7">{ translate('INDEX.LOADING_HISTORY') }...</td>
          </tr>
        );
      } else {
        return (
          <tr className="hover--none">
            <td colSpan="7">{ translate('INDEX.SYNC_IN_PROGRESS') }...</td>
          </tr>
        );
      }
    } else if (this.state.itemsList === 'no data') {
      return (
        <tr className="hover--none">
          <td colSpan="7">{ translate('INDEX.NO_DATA') }</td>
        </tr>
      );
    } else if (this.state.itemsList) {
      return TxHistoryListRender.call(this);
    }

    return null;
  }

  onPageSizeChange(pageSize, pageIndex) {
    this.setState(Object.assign({}, this.state, {
      pageSize: pageSize,
      showPagination: this.state.itemsList && this.state.itemsList.length >= this.state.defaultPageSize,
    }))
  }

  updateAddressSelection(address) {
    Store.dispatch(changeActiveAddress(address));

    this.setState(Object.assign({}, this.state, {
      currentAddress: address,
      addressSelectorOpen: false,
    }));

    if (this.props.ActiveCoin.mode === 'basilisk') {
      setTimeout(() => {
        Store.dispatch(changeMainBasiliskAddress(address));
        Store.dispatch(
          getBasiliskTransactionsList(
            this.props.ActiveCoin.coin,
            address
          )
        );
      }, 100);

      Store.dispatch(fetchNewCacheData({
        pubkey: this.props.Dashboard.activeHandle.pubkey,
        allcoins: false,
        coin: this.props.ActiveCoin.coin,
        calls: 'listtransactions:getbalance',
        address: address,
      }));
    }
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      addressSelectorOpen: !this.state.addressSelectorOpen,
    }));
  }

  renderAddressByType(type) {
    const _addresses = this.props.ActiveCoin.addresses;
    const _coin = this.props.ActiveCoin.coin;

    if (_addresses &&
        _addresses[type] &&
        _addresses[type].length) {
        let items = [];
        const _cache = this.props.ActiveCoin.cache;

        for (let i = 0; i < _addresses[type].length; i++) {
          const address = _addresses[type][i].address;
          let _amount = _addresses[type][i].amount;

          if (this.props.ActiveCoin.mode === 'basilisk') {
            _amount = _cache && _cache[_coin] && _cache[_coin][address] && _cache[_coin][address].getbalance && _cache[_coin][address].getbalance.data && _cache[_coin][address].getbalance.data.balance ? _cache[_coin][address].getbalance.data.balance : 'N/A';
          }

          if (_amount !== 'N/A') {
            _amount = formatValue(_amount);
          }

          items.push(
            AddressItemRender.call(this, address, type, _amount, _coin)
          );
        }

        return items;
    } else if (this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin] && this.props.ActiveCoin.mode === 'basilisk') {
      const address = this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin];

      return AddressItemRender.call(this, address, type, null, _coin);
    }

    return null;
  }

  hasPublicAddresses() {
    return this.props.ActiveCoin.addresses &&
      this.props.ActiveCoin.addresses.public &&
      this.props.ActiveCoin.addresses.public.length;
  }

  renderAddressAmount() {
    if (this.hasPublicAddresses()) {
      const _addresses = this.props.ActiveCoin.addresses;
      const _cache = this.props.ActiveCoin.cache;
      const _coin = this.props.ActiveCoin.coin;

      for (let i = 0; i < _addresses.public.length; i++) {
        if (_addresses.public[i].address === this.state.currentAddress) {
          if (_addresses.public[i].amount &&
              _addresses.public[i].amount !== 'N/A') {
            let _amount = _addresses.public[i].amount;

            if (_amount !== 'N/A') {
              _amount = formatValue(_amount);
            }

            return _amount;
          } else {
            const address = _addresses.public[i].address;
            let _amount;

            if (this.props.ActiveCoin.mode === 'basilisk') {
              _amount = _cache && _cache[_coin] && _cache[_coin][address] && _cache[_coin][address].getbalance.data && _cache[_coin][address].getbalance.data.balance ? _cache[_coin][address].getbalance.data.balance : 'N/A';
            } else {
              _amount = _addresses.public[i].amount;
            }

            if (_amount !== 'N/A') {
              _amount = formatValue(_amount);
            }

            return _amount;
          }
        }
      }
    } else {
      return 0;
    }
  }

  renderSelectorCurrentLabel() {
    const _currentAddress = this.state.currentAddress;

    if (_currentAddress) {
      return (
        <span>
          <i className={ 'icon fa-eye' + (this.state.addressType === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
          <span className="text">
            [ { this.renderAddressAmount() } { this.props.ActiveCoin.coin } ]&nbsp;&nbsp;
            { _currentAddress }
          </span>
        </span>
      );
    } else {
      return (
        <span>{ translate('INDEX.FILTER_BY_ADDRESS') }</span>
      );
    }
  }

  shouldDisplayAddressList() {
    if (this.props.ActiveCoin.mode === 'basilisk') {
      return this.props.Dashboard &&
        this.props.Dashboard.activeHandle &&
        this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin];
    }
  }

  renderAddressList() {
    if (this.shouldDisplayAddressList()) {
      return AddressListRender.call(this);
    } else {
      return null;
    }
  }

  onSearchTermChange(newSearchTerm) {
    this.setState(Object.assign({}, this.state, {
      searchTerm: newSearchTerm,
      filteredItemsList: this.filterTransactions(this.state.itemsList, newSearchTerm),
    }));
  }

  filterTransactions(txList, searchTerm) {
    return txList.filter(tx => this.filterTransaction(tx, searchTerm));
  }

  filterTransaction(tx, term) {
    if (!term) {
      return true;
    }

    return this.contains(tx.address, term)
      || this.contains(tx.confirmations, term)
      || this.contains(tx.amount, term)
      || this.contains(tx.type, term)
      || this.contains(secondsToString(tx.blocktime || tx.timestamp || tx.time), term);
  }

  contains(value, property) {
    return (value + '').indexOf(property) !== -1;
  }

  isActiveCoinMode(coinMode) {
    return this.props.ActiveCoin.mode === coinMode;
  }

  isNativeMode() {
    return this.isActiveCoinMode('native');
  }

  isFullMode() {
    return this.isActiveCoinMode('full');
  }

  isBasiliskMode() {
    return this.isActiveCoinMode('basilisk');
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.coin &&
        (
          this.props.ActiveCoin.mode !== 'native' &&
          !this.props.ActiveCoin.send &&
          !this.props.ActiveCoin.receive
        ) || (
          this.props.ActiveCoin.mode === 'native' &&
          this.props.ActiveCoin.activeSection === 'default'
        )) {
      return WalletsDataRender.call(this);
    } else {
      return null;
    }
  }
}

export default WalletsData;
