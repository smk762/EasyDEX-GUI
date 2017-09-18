import {
  SYNC_ONLY_MODAL_TOGGLE,
  SYNC_ONLY_DATA
} from '../actions/storeType';

export function SyncOnly(state = {
  display: false,
  forks: null
}, action) {
  switch (action.type) {
    case SYNC_ONLY_MODAL_TOGGLE:
      return {
        ...state,
        display: action.display,
      };
    case SYNC_ONLY_DATA:
      return {
        ...state,
        forks: action.forks,
      };
    default:
      return state;
  }
}

export default SyncOnly;
