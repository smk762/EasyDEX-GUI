import React from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../translate/translate';
import { sortByDate } from '../../../util/sort';
import { formatValue } from '../../../util/formatValue';
import Config from '../../../config';
import {
  toggleDashboardTxInfoModal,
  changeActiveAddress,
  getDashboardUpdate,
  shepherdElectrumTransactions,
  toggleClaimInterestModal,
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

/*import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

const socket = io.connect(`http://127.0.0.1:${Config.agamaPort}`);*/

class WalletsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.refreshTxHistory = this.refreshTxHistory.bind(this);
    this.openClaimInterestModal = this.openClaimInterestModal.bind(this);
    this.displayClaimInterestUI = this.displayClaimInterestUI.bind(this);
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    /*setTimeout(() => {
      if (this.props.ActiveCoin.mode === 'basilisk' || (Object.keys(this.props.Main.coins.basilisk).length && (Object.keys(this.props.Main.coins.native).length || Object.keys(this.props.Main.coins.full).length)) || Object.keys(this.props.Main.coins.basilisk).length) {
        socket.on('messages', msg => this.updateSocketsData(msg));
      } else {
        socket.removeAllListeners('messages');
      }
    }, 100);*/
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    // socket.removeAllListeners('messages');
  }

  displayClaimInterestUI() {
    if (this.props.ActiveCoin &&
        this.props.ActiveCoin.coin === 'KMD' &&
        this.props.ActiveCoin.mode === 'native' &&
        this.props.ActiveCoin.balance &&
        this.props.ActiveCoin.balance.interest &&
        this.props.ActiveCoin.balance.interest > 0) {
      return true;
    }
  }

  openClaimInterestModal() {
    Store.dispatch(toggleClaimInterestModal(true));
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

    columns.push({
      Header: translate('INDEX.TYPE'),
      Footer: translate('INDEX.TYPE'),
      className: 'colum--type',
      headerClassName: 'colum--type',
      footerClassName: 'colum--type',
      Cell: AddressTypeRender(),
    });

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

    columns.push({
      id: 'destination-address',
      Header: translate('INDEX.DEST_ADDRESS'),
      Footer: translate('INDEX.DEST_ADDRESS'),
      accessor: (tx) => AddressRender.call(this, tx),
    });

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

  refreshTxHistory() {
    if (this.props.ActiveCoin.mode === 'native') {
      Store.dispatch(getDashboardUpdate(this.props.ActiveCoin.coin));
    } else if (this.props.ActiveCoin.mode === 'spv') {
      Store.dispatch(shepherdElectrumTransactions(this.props.ActiveCoin.coin, this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].pub));
    }
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
    let _stateChange = {};

    // TODO: figure out why changing ActiveCoin props doesn't trigger comp update
    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory !== 'loading' &&
        this.props.ActiveCoin.txhistory !== 'no data' &&
        this.props.ActiveCoin.txhistory !== 'connection error or incomplete data' &&
        this.props.ActiveCoin.txhistory !== 'cant get current height' &&
        this.props.ActiveCoin.txhistory.length) {
      _stateChange = Object.assign({}, _stateChange, {
        itemsList: this.props.ActiveCoin.txhistory,
        filteredItemsList: this.filterTransactions(this.props.ActiveCoin.txhistory, this.state.searchTerm),
        txhistory: this.props.ActiveCoin.txhistory,
        showPagination: this.props.ActiveCoin.txhistory && this.props.ActiveCoin.txhistory.length >= this.state.defaultPageSize,
        itemsListColumns: this.generateItemsListColumns(),
      });
    }

    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory === 'no data') {
      _stateChange = Object.assign({}, _stateChange, {
        itemsList: 'no data',
      });
    } else if (this.props.ActiveCoin.txhistory && this.props.ActiveCoin.txhistory === 'loading') {
      _stateChange = Object.assign({}, _stateChange, {
        itemsList: 'loading',
      });
    } else if ((this.props.ActiveCoin.txhistory && this.props.ActiveCoin.txhistory === 'connection error or incomplete data') ||
      (this.props.ActiveCoin.txhistory && this.props.ActiveCoin.txhistory === 'cant get current height')) {
      _stateChange = Object.assign({}, _stateChange, {
        itemsList: 'connection error',
      });
    }

    this.setState(Object.assign({}, _stateChange));
  }

  isFullySynced() {
    const _progress = this.props.ActiveCoin.progress;

    if (_progress &&
        (Number(_progress.balances) +
        Number(_progress.validated) +
        Number(_progress.bundles) +
        Number(_progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
  }

  renderTxHistoryList() {
    if (this.state.itemsList === 'loading') {
      if (this.isFullySynced()) {
        return (
          <tr className="hover--none">
            <td colSpan="7" className="table-cell-offset-16">{ translate('INDEX.LOADING_HISTORY') }...</td>
          </tr>
        );
      } else {
        return (
          <tr className="hover--none">
            <td colSpan="7" className="table-cell-offset-16">{ translate('INDEX.SYNC_IN_PROGRESS') }...</td>
          </tr>
        );
      }
    } else if (this.state.itemsList === 'no data') {
      return (
        <tr className="hover--none">
          <td colSpan="7" className="table-cell-offset-16">{ translate('INDEX.NO_DATA') }</td>
        </tr>
      );
    } else if (this.state.itemsList === 'connection error') {
      return (
        <tr className="hover--none">
          <td colSpan="7" className="table-cell-offset-16 color-warning">
            Connection error!
            <span className={ this.props.Dashboard.electrumCoins[this.props.ActiveCoin.coin].serverList !== 'none' ? '' : 'hide' }>
            <br/>Try to connect to another SPV server.
            <br/>To do that go to "Settings", select "SPV Server List" tab, choose new server and click "OK".
            </span>
          </td>
        </tr>
      );
    } else if (this.state.itemsList && this.state.itemsList.length) {
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

      for (let i = 0; i < _addresses[type].length; i++) {
        const address = _addresses[type][i].address;
        let _amount = _addresses[type][i].amount;

        if (_amount !== 'N/A') {
          _amount = formatValue(_amount);
        }

        items.push(
          AddressItemRender.call(this, address, type, _amount, _coin)
        );
      }

      return items;
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
            let _amount = _addresses.public[i].amount;

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

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.coin &&
        //this.props.ActiveCoin.mode === 'native' &&
        this.props.ActiveCoin.activeSection === 'default'
        ) {
      return WalletsDataRender.call(this);
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
      mode: state.ActiveCoin.mode,
      send: state.ActiveCoin.send,
      receive: state.ActiveCoin.receive,
      balance: state.ActiveCoin.balance,
      cache: state.ActiveCoin.cache,
      activeSection: state.ActiveCoin.activeSection,
      activeAddress: state.ActiveCoin.activeAddress,
      lastSendToResponse: state.ActiveCoin.lastSendToResponse,
      addresses: state.ActiveCoin.addresses,
      txhistory: state.ActiveCoin.txhistory,
      showTransactionInfo: state.ActiveCoin.showTransactionInfo,
      progress: state.ActiveCoin.progress,
    },
    Main: state.Main,
    Dashboard: state.Dashboard,
  };
};

export default connect(mapStateToProps)(WalletsData);