import {
  DASHBOARD_ACTIVE_COIN_CHANGE,
  DASHBOARD_ACTIVE_COIN_BALANCE,
  DASHBOARD_ACTIVE_COIN_SEND_FORM,
  DASHBOARD_ACTIVE_COIN_RECEIVE_FORM,
  DASHBOARD_ACTIVE_COIN_RESET_FORMS,
  DASHBOARD_ACTIVE_SECTION,
  DASHBOARD_ACTIVE_TXINFO_MODAL,
  ACTIVE_COIN_GET_ADDRESSES,
  DASHBOARD_ACTIVE_COIN_NATIVE_BALANCE,
  DASHBOARD_ACTIVE_COIN_NATIVE_TXHISTORY,
  DASHBOARD_ACTIVE_COIN_NATIVE_OPIDS,
  DASHBOARD_ACTIVE_COIN_SENDTO,
  DASHBOARD_ACTIVE_ADDRESS,
  DASHBOARD_ACTIVE_COIN_GETINFO_FAILURE,
  SYNCING_NATIVE_MODE,
  DASHBOARD_UPDATE,
  DASHBOARD_ELECTRUM_BALANCE,
  DASHBOARD_ELECTRUM_TRANSACTIONS,
  DASHBOARD_REMOVE_COIN,
  DASHBOARD_ACTIVE_COIN_NET_PEERS,
  DASHBOARD_ACTIVE_COIN_NET_TOTALS,
  KV_HISTORY,
  DASHBOARD_ETHEREUM_BALANCE,
  DASHBOARD_ETHEREUM_TRANSACTIONS,
  DASHBOARD_CLEAR_ACTIVECOIN,
} from '../actions/storeType';

// TODO: refactor current coin props copy on change

const defaults = {
  native: {
    coin: null,
    mode: null,
    send: false,
    receive: false,
    balance: 0,
    addresses: null,
    activeSection: 'default',
    showTransactionInfo: false,
    showTransactionInfoTxIndex: null,
    txhistory: [],
    opids: null,
    lastSendToResponse: null,
    progress: null,
    rescanInProgress: false,
    getinfoFetchFailures: 0,
    net: {
      peers: null,
      totals: null,
    },
  },
  spv: {
    coin: null,
    mode: null,
    send: false,
    receive: false,
    balance: 0,
    addresses: null,
    activeSection: 'default',
    showTransactionInfo: false,
    showTransactionInfoTxIndex: null,
    txhistory: [],
    lastSendToResponse: null,
  },
  eth: {
    coin: null,
    mode: null,
    send: false,
    receive: false,
    balance: 0,
    addresses: null,
    activeSection: 'default',
    showTransactionInfo: false,
    showTransactionInfoTxIndex: null,
    txhistory: [],
    lastSendToResponse: null,
  },
};

const checkCoinObjectKeys = (obj, mode) => {
  if (Object.keys(obj).length &&
      mode) {
    for (let key in obj) {
      if (!defaults[mode].hasOwnProperty(key)) {
        delete obj[key];
      }
    }
  }

  return obj;
};

export const ActiveCoin = (state = {
  coins: {
    native: {},
    spv: {},
    eth: {},
  },
  coin: null,
  mode: null,
  send: false,
  receive: false,
  balance: 0,
  addresses: null,
  activeSection: 'default',
  showTransactionInfo: false,
  showTransactionInfoTxIndex: null,
  txhistory: [],
  opids: null,
  lastSendToResponse: null,
  activeAddress: null,
  progress: null,
  rescanInProgress: false,
  getinfoFetchFailures: 0,
  net: {
    peers: null,
    totals: null,
  },
}, action) => {
  switch (action.type) {
    case DASHBOARD_REMOVE_COIN:
      delete state.coins[action.mode][action.coin];

      if (state.coin === action.coin) {
        return {
          ...state,
          ...defaults[action.mode],
        };
      } else {
        return {
          ...state,
        };
      }
    case DASHBOARD_ACTIVE_COIN_CHANGE:
      if (state.coins[action.mode] &&
          state.coins[action.mode][action.coin]) {
        let _coins = state.coins;
        
        if (action.mode === state.mode) {
          const _coinData = state.coins[action.mode][action.coin];
          const _coinDataToStore = checkCoinObjectKeys({
            addresses: state.addresses,
            coin: state.coin,
            mode: state.mode,
            balance: state.balance,
            txhistory: state.txhistory,
            send: state.send,
            receive: state.receive,
            showTransactionInfo: state.showTransactionInfo,
            showTransactionInfoTxIndex: state.showTransactionInfoTxIndex,
            activeSection: state.activeSection,
            lastSendToResponse: state.lastSendToResponse,
            opids: state.mode === 'native' ? state.opids : null,
            activeAddress: state.activeAddress,
            progress: state.mode === 'native' ? state.progress : null,
            rescanInProgress: state.mode === 'native' ? state.rescanInProgress : false,
            getinfoFetchFailures: state.mode === 'native' ? state.getinfoFetchFailures : 0,
            net: state.mode === 'native' ? state.net : {},
          }, action.mode);

          if (!action.skip) {
            _coins[action.mode][state.coin] = _coinDataToStore;
          }
          delete _coins.undefined;
          
          return {
            ...state,
            coins: _coins,
            ...checkCoinObjectKeys({
              addresses: _coinData.addresses,
              coin: _coinData.coin,
              mode: _coinData.mode,
              balance: _coinData.balance,
              txhistory: _coinData.txhistory,
              send: _coinData.send,
              receive: _coinData.receive,
              showTransactionInfo: _coinData.showTransactionInfo,
              showTransactionInfoTxIndex: _coinData.showTransactionInfoTxIndex,
              activeSection: _coinData.activeSection,
              lastSendToResponse: _coinData.lastSendToResponse,
              opids: _coinData.mode === 'native' ? _coinData.opids : null,
              activeAddress: _coinData.activeAddress,
              progress: _coinData.mode === 'native' ? _coinData.progress : null,
              rescanInProgress: _coinData.mode === 'native' ? _coinData.rescanInProgress : false,
              getinfoFetchFailures: _coinData.mode === 'native' ? _coinData.getinfoFetchFailures : 0,
              net: _coinData.mode === 'native' ? _coinData.net : {},
            }, _coinData.mode),
          };
        } else {
          delete _coins.undefined;

          return {
            ...state,
            coins: state.coins,
            ...checkCoinObjectKeys({
              coin: action.coin,
              mode: action.mode,
              balance: 0,
              addresses: null,
              txhistory: 'loading',
              send: false,
              receive: false,
              showTransactionInfo: false,
              showTransactionInfoTxIndex: null,
              activeSection: 'default',
              progress: null,
              rescanInProgress: false,
              net: {
                peers: null,
                totals: null,
              },
            }, action.mode),
          };
        }
      } else {
        if (state.coin) {
          const _coinData = checkCoinObjectKeys({
            addresses: state.addresses,
            coin: state.coin,
            mode: state.mode,
            balance: state.balance,
            txhistory: state.txhistory,
            send: state.send,
            receive: state.receive,
            showTransactionInfo: state.showTransactionInfo,
            showTransactionInfoTxIndex: state.showTransactionInfoTxIndex,
            activeSection: state.activeSection,
            lastSendToResponse: state.lastSendToResponse,
            opids: state.mode === 'native' ? state.opids : null,
            activeAddress: state.activeAddress,
            progress: state.mode === 'native' ? state.progress : null,
            rescanInProgress: state.mode === 'native' ? state.rescanInProgress : false,
            getinfoFetchFailures: state.mode === 'native' ? state.getinfoFetchFailures : 0,
            net: state.mode === 'native' ? state.net : {},
          }, state.mode);
          let _coins = state.coins;

          if (!action.skip &&
              _coins[action.mode]) {
            _coins[action.mode][state.coin] = _coinData;
          }

          return {
            ...state,
            coins: _coins,
            ...checkCoinObjectKeys({
              coin: action.coin,
              mode: action.mode,
              balance: 0,
              addresses: null,
              txhistory: 'loading',
              send: false,
              receive: false,
              showTransactionInfo: false,
              showTransactionInfoTxIndex: null,
              activeSection: 'default',
              progress: null,
              rescanInProgress: false,
              net: {
                peers: null,
                totals: null,
              },
            }, action.mode),
          };
        } else {
          return {
            ...state,
            ...checkCoinObjectKeys({
              coin: action.coin,
              mode: action.mode,
              balance: 0,
              addresses: null,
              txhistory: 'loading',
              send: false,
              receive: false,
              showTransactionInfo: false,
              showTransactionInfoTxIndex: null,
              activeSection: 'default',
              progress: null,
              rescanInProgress: false,
              net: {
                peers: null,
                totals: null,
              },
            }, action.mode),
          };
        }
      }
    case DASHBOARD_ELECTRUM_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };
    case DASHBOARD_ELECTRUM_TRANSACTIONS:
      return {
        ...state,
        txhistory: action.txhistory,
      };
    case DASHBOARD_ACTIVE_COIN_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };
    case DASHBOARD_ACTIVE_COIN_SEND_FORM:
      return {
        ...state,
        send: action.send,
        receive: false,
      };
    case DASHBOARD_ACTIVE_COIN_RECEIVE_FORM:
      return {
        ...state,
        send: false,
        receive: action.receive,
      };
    case DASHBOARD_ACTIVE_COIN_RESET_FORMS:
      return {
        ...state,
        send: false,
        receive: false,
      };
    case ACTIVE_COIN_GET_ADDRESSES:
      return {
        ...state,
        addresses: action.addresses,
      };
    case DASHBOARD_ACTIVE_SECTION:
      return {
        ...state,
        activeSection: action.section,
      };
    case DASHBOARD_ACTIVE_TXINFO_MODAL:
      return {
        ...state,
        showTransactionInfo: action.showTransactionInfo,
        showTransactionInfoTxIndex: action.showTransactionInfoTxIndex,
      };
    case DASHBOARD_ACTIVE_COIN_NATIVE_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };
    case DASHBOARD_ACTIVE_COIN_NATIVE_TXHISTORY:
      return {
        ...state,
        txhistory: action.txhistory,
      };
    case DASHBOARD_ACTIVE_COIN_NATIVE_OPIDS:
      return {
        ...state,
        opids: action.opids,
      };
    case DASHBOARD_ACTIVE_COIN_SENDTO:
      return {
        ...state,
        lastSendToResponse: action.lastSendToResponse,
      };
    case DASHBOARD_ACTIVE_ADDRESS:
      return {
        ...state,
        activeAddress: action.address,
      };
    case SYNCING_NATIVE_MODE:
      return {
        ...state,
        progress: state.mode === 'native' ? action.progress : null,
        getinfoFetchFailures: typeof action.progress === 'string' && action.progress.indexOf('"code":-777') ? state.getinfoFetchFailures + 1 : 0,
      };
    case DASHBOARD_ACTIVE_COIN_GETINFO_FAILURE:
      return {
        ...state,
        getinfoFetchFailures: state.getinfoFetchFailures + 1,
      };
    case DASHBOARD_UPDATE:
      if (state.coin === action.coin) {
        return {
          ...state,
          opids: action.opids,
          txhistory: action.txhistory,
          balance: action.balance,
          addresses: action.addresses,
          rescanInProgress: action.rescanInProgress,
        };
      }
    case DASHBOARD_ACTIVE_COIN_NET_PEERS:
      return {
        ...state,
        net: {
          peers: action.peers,
          totals: state.net.totals,
        },
      };
    case DASHBOARD_ACTIVE_COIN_NET_TOTALS:
      return {
        ...state,
        net: {
          peers: state.net.peers,
          totals: action.totals,
        },
      };
    case DASHBOARD_ETHEREUM_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };
    case DASHBOARD_ETHEREUM_TRANSACTIONS:
      return {
        ...state,
        txhistory: action.txhistory,
      };
    case DASHBOARD_CLEAR_ACTIVECOIN:
      return {
        coins: {
          native: {},
          spv: {},
          eth: {},
        },
        coin: null,
        mode: null,
        balance: 0,
        addresses: null,
        txhistory: 'loading',
        send: false,
        receive: false,
        showTransactionInfo: false,
        showTransactionInfoTxIndex: null,
        activeSection: 'default',
        progress: null,
        rescanInProgress: false,
        net: {
          peers: null,
          totals: null,
        },
        getinfoFetchFailures: 0,
      };
    default:
      return state;
  }
}

export default ActiveCoin;