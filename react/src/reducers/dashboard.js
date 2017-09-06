import {
  DASHBOARD_SECTION_CHANGE,
  GET_MAIN_ADDRESS,
  VIEW_CACHE_DATA,
  TOGGLE_NOTIFICATIONS_MODAL,
  DISPLAY_COIND_DOWN_MODAL,
  DISPLAY_CLAIM_INTEREST_MODAL
} from '../actions/storeType';

export function Dashboard(state = {
  activeSection: 'wallets',
  activeHandle: null,
  displayViewCacheModal: false,
  guiLog: {},
  displayCoindDownModal: false,
  displayClaimInterestModal: false,
}, action) {
  switch (action.type) {
    case DASHBOARD_SECTION_CHANGE:
      return {
        ...state,
        activeSection: action.activeSection,
      };
    case GET_MAIN_ADDRESS:
      return {
        ...state,
        activeHandle: action.activeHandle,
      };
    case VIEW_CACHE_DATA:
      return {
        ...state,
        displayViewCacheModal: action.display,
      };
    case DISPLAY_COIND_DOWN_MODAL:
      return {
        ...state,
        displayCoindDownModal: action.displayCoindDownModal,
      };
      break;
    case DISPLAY_CLAIM_INTEREST_MODAL:
      return {
        ...state,
        displayClaimInterestModal: action.displayClaimInterestModal,
      };
      break;
    default:
      return state;
  }
}

export default Dashboard;
