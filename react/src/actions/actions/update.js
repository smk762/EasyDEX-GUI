import { triggerToaster } from '../actionCreators';
import Config from '../../config';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function checkForUpdateUIPromise() {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/update/patch/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'checkForUpdateUIPromise',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}

export function updateUIPromise() {
  return new Promise((resolve, reject) => {
    fetch(`http://127.0.0.1:${Config.agamaPort}/shepherd/update/patch`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(
        triggerToaster(
          'updateUIPromise',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}