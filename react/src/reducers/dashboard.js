import {
  DASHBOARD_SECTION_CHANGE,
  GET_MAIN_ADDRESS,
  VIEW_CACHE_DATA,
  TOGGLE_NOTIFICATIONS_MODAL,
  DISPLAY_COIND_DOWN_MODAL,
  DISPLAY_CLAIM_INTEREST_MODAL,
  DASHBOARD_SYNC_ONLY_UPDATE,
  DISPLAY_IMPORT_KEY_MODAL,
} from '../actions/storeType';

export function Dashboard(state = {
  activeSection: 'wallets',
  activeHandle: null,
  displayViewCacheModal: false,
  guiLog: {},
  displayCoindDownModal: false,
  displayClaimInterestModal: false,
  skipFullDashboardUpdate: false,
  displayImportKeyModal: false,
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
    case DISPLAY_IMPORT_KEY_MODAL:
      return {
        ...state,
        displayImportKeyModal: action.displayImportKeyModal,
      };
      break;
    case DASHBOARD_SYNC_ONLY_UPDATE:
      return {
        ...state,
        skipFullDashboardUpdate: action.skipFullDashboardUpdate,
      };
    default:
      return state;
  }
}

export default Dashboard;
