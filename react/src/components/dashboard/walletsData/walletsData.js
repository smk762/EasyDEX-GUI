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
      currentAddress: null,
      addressSelectorOpen: false,
      currentStackLength: 0,
      totalStackLength: 0,
      useCache: true,
      itemsListColumns: this.generateItemsListColumns(),
      pageSize: 20,
      showPagination: false
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
    socket.on('messages', msg => this.updateSocketsData(msg));
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
    socket.off('messages');
  }

  generateItemsListColumns() {
    let columns = [];

    if (this.isNativeMode()) {
      columns.push({
        Header: translate('INDEX.TYPE'),
        Footer: translate('INDEX.TYPE'),
        Cell: AddressTypeRender()
      });
    }

    columns.push(...[
      {
        id: 'direction',
        Header: translate('INDEX.DIRECTION'),
        Footer: translate('INDEX.DIRECTION'),
        accessor: (tx) => TxTypeRender.call(this, tx.category || tx.type)
      },
      {
        Header: translate('INDEX.CONFIRMATIONS'),
        Footer: translate('INDEX.CONFIRMATIONS'),
        headerClassName: 'hidden-xs hidden-sm',
        footerClassName: 'hidden-xs hidden-sm',
        className: 'hidden-xs hidden-sm',
        accessor: 'confirmations'
      },
      {
        id: 'amount',
        Header: translate('INDEX.AMOUNT'),
        Footer: translate('INDEX.AMOUNT'),
        accessor: (tx) => TxAmountRender.call(this, tx)
      },
      {
        id: 'timestamp',
        Header: translate('INDEX.TIME'),
        Footer: translate('INDEX.TIME'),
        accessor: (tx) => secondsToString(tx.blocktime || tx.timestamp || tx.time)
      }
    ]);

    if (this.isFullMode()) {
      columns.push({
        Header: translate('INDEX.DEST_ADDRESS'),
        Footer: translate('INDEX.DEST_ADDRESS'),
        accessor: 'address'
      });
    }

    if (this.isNativeMode()) {
      columns.push({
        id: 'destination-address',
        Header: translate('INDEX.DEST_ADDRESS'),
        Footer: translate('INDEX.DEST_ADDRESS'),
        accessor: (tx) => AddressRender.call(this, tx)
      });
    }

    const txDetailColumnCssClasses = this.isBasiliskMode() ? 'hidden-xs hidden-sm text-center' : 'hidden-xs hidden-sm';

    columns.push({
      id: 'tx-detail',
      Header: translate('INDEX.TX_DETAIL'),
      Footer: translate('INDEX.TX_DETAIL'),
      headerClassName: txDetailColumnCssClasses,
      footerClassName: txDetailColumnCssClasses,
      className: txDetailColumnCssClasses,
      Cell: props => TransactionDetailRender.call(this, props.index)
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
    if (data &&
        data.message &&
        data.message.shepherd.iguanaAPI &&
        data.message.shepherd.iguanaAPI.totalStackLength) {
      this.setState(Object.assign({}, this.state, {
        totalStackLength: data.message.shepherd.iguanaAPI.totalStackLength,
      }));
    }
    if (data &&
        data.message &&
        data.message.shepherd.iguanaAPI &&
        data.message.shepherd.iguanaAPI.currentStackLength) {
      this.setState(Object.assign({}, this.state, {
        currentStackLength: data.message.shepherd.iguanaAPI.currentStackLength,
      }));
    }
    if (data &&
        data.message &&
        data.message.shepherd.method &&
        data.message.shepherd.method === 'cache-one' &&
        data.message.shepherd.status === 'done') {
      Store.dispatch(basiliskRefresh(false));
    }
  }

  refreshTxHistory() {
    const _mode = this.props.ActiveCoin.mode;
    const _coin = this.props.ActiveCoin.coin;

    switch(_mode) {
      case 'basilisk':
        Store.dispatch(fetchNewCacheData({
          'pubkey': this.props.Dashboard.activeHandle.pubkey,
          'allcoins': false,
          'coin': _coin,
          'calls': 'listtransactions',
          'skip': true,
          'address': this.state.currentAddress,
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
      'pubkey': this.props.Dashboard.activeHandle.pubkey,
      'allcoins': false,
      'coin': this.props.ActiveCoin.coin,
      'calls': 'listtransactions:getbalance',
      'address': this.state.currentAddress,
    }));
  }

  _fetchUtxoCache() {
    Store.dispatch(fetchUtxoCache({
      'pubkey': this.props.Dashboard.activeHandle.pubkey,
      'allcoins': false,
      'coin': this.props.ActiveCoin.coin,
      'calls': 'refresh',
      'address': this.state.currentAddress,
    }));
  }

  toggleBasiliskActionsMenu() {
    this.setState(Object.assign({}, this.state, {
      basiliskActionsMenu: !this.state.basiliskActionsMenu,
    }));
  }

  basiliskRefreshAction() {
    Store.dispatch(fetchNewCacheData({
      'pubkey': this.props.Dashboard.activeHandle.pubkey,
      'allcoins': false,
      'coin': this.props.ActiveCoin.coin,
      'calls': 'listtransactions:getbalance',
    }));
  }

  basiliskRefreshActionOne() {
    Store.dispatch(fetchNewCacheData({
      'pubkey': this.props.Dashboard.activeHandle.pubkey,
      'allcoins': false,
      'coin': this.props.ActiveCoin.coin,
      'calls': 'listtransactions:getbalance',
      'address': this.props.ActiveCoin.activeAddress,
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

  componentWillReceiveProps(props) {
    if (!this.state.currentAddress &&
        this.props.ActiveCoin.activeAddress) {
      this.setState(Object.assign({}, this.state, {
        currentAddress: this.props.ActiveCoin.activeAddress,
      }));
    }

    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory !== 'loading' &&
        this.props.ActiveCoin.txhistory !== 'no data' &&
        this.props.ActiveCoin.txhistory.length) {
      if (!this.state.itemsList ||
          (this.state.itemsList && !this.state.itemsList.length) ||
          (props.ActiveCoin.txhistory !== this.props.ActiveCoin.txhistory)) {
        this.setState(Object.assign({}, this.state, {
          itemsList: sortByDate(this.props.ActiveCoin.txhistory.slice(0, 30)),
          showPagination: this.props.ActiveCoin.txhistory && this.props.ActiveCoin.txhistory.length >= this.state.pageSize
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
      itemsListColumns: this.generateItemsListColumns()
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
    if (this.state.itemsList === 'loading') {
      if (!this.isNativeMode() || this.isFullySynced()) {
        return (
          <tr>
            <td colSpan="6">{ translate('INDEX.LOADING_HISTORY') }...</td>
          </tr>
        );
      }
    } else if (this.state.itemsList === 'no data' || this.state.itemsList.length == 0) {
      return (
        <tr>
          <td colSpan="6">{ translate('INDEX.NO_DATA') }</td>
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
      showPagination: this.state.itemsList && this.state.itemsList.length >= pageSize
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
        'pubkey': this.props.Dashboard.activeHandle.pubkey,
        'allcoins': false,
        'coin': this.props.ActiveCoin.coin,
        'calls': 'listtransactions:getbalance',
        'address': address,
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
          let _amount = address.amount;

          if (this.props.ActiveCoin.mode === 'basilisk') {
            _amount = _cache && _cache[_coin] && _cache[_coin][address] && _cache[_coin][address].getbalance.data && _cache[_coin][address].getbalance.data.balance ? _cache[_coin][address].getbalance.data.balance : 'N/A';
          }

          _amount = formatValue('round', _amount, -6);

          items.push(
            AddressItemRender.call(this, address, type, _amount, _coin)
          );
        }

        return items;
    } else if (this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin]) {
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
            return _addresses.public[i].amount;
          } else {
            const address = _addresses.public[i].address;
            let _amount = _cache && _cache[_coin] && _cache[_coin][address] && _cache[_coin][address].getbalance.data && _cache[_coin][address].getbalance.data.balance ? _cache[_coin][address].getbalance.data.balance : 'N/A';

            _amount = formatValue('round', _amount, -6);

            return _amount;
          }
        }
      }
    } else {
      return 0;
    }
  }

  renderSelectorCurrentLabel() {
    if (this.state.currentAddress) {
      return (
        <span>
          <i className={ 'icon fa-eye' + (this.state.addressType === 'public' ? '' : '-slash') }></i>&nbsp;&nbsp;
          <span className="text">
            [ { this.renderAddressAmount() } { this.props.ActiveCoin.coin } ]&nbsp;&nbsp;
            { this.state.currentAddress }
          </span>
        </span>
      );
    } else {
      return (
        <span>- { translate('KMD_NATIVE.SELECT_ADDRESS') } -</span>
      );
    }
  }

  renderAddressList() {
    if (this.props.Dashboard &&
        this.props.Dashboard.activeHandle &&
        this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin]) {
      return AddressListRender.call(this);
    } else {
      return null;
    }
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
        !this.props.ActiveCoin.send &&
        !this.props.ActiveCoin.receive) {
      return WalletsDataRender.call(this);
    } else {
      return null;
    }
  }
}

export default WalletsData;
