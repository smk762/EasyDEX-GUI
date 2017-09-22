import {
  GET_ACTIVE_COINS,
  DISPLAY_LOGIN_SETTINGS_MODAL
} from '../actions/storeType';

export function Main(state = {
  activeCoins: [],
  displayLoginSettingsModal: false,
}, action) {
  switch (action.type) {
    case GET_ACTIVE_COINS:
      return {
        ...state,
        activeCoins: action.activeCoins,
        coins: action.coins,
      };
    case DISPLAY_LOGIN_SETTINGS_MODAL:
      return {
        ...state,
        displayLoginSettingsModal: action.displayLoginSettingsModal,
      };
    default:
      return state;
  }
}

export default Main;
