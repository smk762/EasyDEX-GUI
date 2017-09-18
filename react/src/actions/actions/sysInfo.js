import { triggerToaster } from '../actionCreators';
import Config from '../../config';

export function shepherdGetSysInfo() {
  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/sysinfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'shepherdGetSysInfo',
          'Error',
          'error'
        )
      )
    })
    .then(response => response.json())
    .then(json => console.log(json));
  }
}