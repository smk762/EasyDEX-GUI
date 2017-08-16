import {
  GET_ACTIVE_COINS,
  LOGIN,
  ACTIVE_HANDLE,
  DISPLAY_LOGIN_SETTINGS_MODAL
} from '../actions/storeType';

export function Main(state = {
  isLoggedIn: false,
  activeCoins: [],
  displayLoginSettingsModal: false,
}, action) {
  switch (action.type) {
    case GET_ACTIVE_COINS:
      return Object.assign({}, state, {
        activeCoins: action.activeCoins,
        coins: action.coins,
      });
    case LOGIN:
      return Object.assign({}, state, {
        isLoggedIn: action.isLoggedIn,
      });
    case ACTIVE_HANDLE:
      return Object.assign({}, state, {
        isLoggedIn: action.isLoggedIn,
        activeHandle: action.handle,
      });
    case DISPLAY_LOGIN_SETTINGS_MODAL:
      return Object.assign({}, state, {
        displayLoginSettingsModal: action.displayLoginSettingsModal,
      });
    default:
      return state;
  }
}

export default Main;
