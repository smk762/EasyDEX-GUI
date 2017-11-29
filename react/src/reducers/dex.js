// charts data(?)

import {
  DEX_LOGIN,
  DEX_LOGOUT,
  DEX_ASKS,
  DEX_BIDS,
  DEX_SWAPS,
  DEX_LOGOUT,
  DEX_ADD_COIN,
  DEX_REMOVE_COIN,
  DEX_INVENTORY,
  DEX_UTXO,
} from '../actions/storeType';

export function Dex(state = {
  display: false,
  isAuth: false,
  asks: [],
  bids: [],
  pair: {
    rel: null,
    base: null,
  },
  coins: {},
  swaps: [],
}, action) {
  switch (action.type) {
    case DEX_RESET:
      return {
        display: false,
        isAuth: false,
        asks: [],
        bids: [],
        pair: {
          rel: null,
          base: null,
        },
        coins: {},
        swaps: [],
      };
    case DEX_LOGIN:
      return {
        ...state,
        isAuth: action.isAuth,
      };
    case DEX_LOGOUT:
      return {
        ...state,
      };
    case DEX_ASKS:
      return {
        ...state,
      };
    case DEX_BIDS:
      return {
        ...state,
      };
    case DEX_ADD_COIN:
      return {
        ...state,
      };
    case DEX_REMOVE_COIN:
      return {
        ...state,
      };
    case DEX_SWAPS:
      return {
        ...state,
      };
    case DEX_INVENTORY:
      return {
        ...state,
      };
    case DEX_UTXO:
      return {
        ...state,
      };
    default:
      return state;
  }
}

export default Dex;