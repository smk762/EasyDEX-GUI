import {} from '../actions/storeType';
import { GET_PIN_LIST } from "../actions/storeType";

export function login(state = {
  pinList: [],
}, action) {
  if (state === null) state = {toasts: []};

  switch (action.type) {
    case GET_PIN_LIST:
      return Object.assign({}, state, {
        pinList: action.pinList
      });
    default:
      return state;
  }
}

export default login;
