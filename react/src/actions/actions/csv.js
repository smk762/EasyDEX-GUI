import translate from '../../translate/translate';
import Config, {
  token,
  agamaPort,
} from '../../config';
import { triggerToaster } from '../actionCreators';
import Store from '../../store';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';

export const shepherdElectrumTransactionsCSV = (coin, address) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      address,
      coin,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/electrum/listtransactions/csv${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumTransactionsCSV',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}

export const shepherdNativeTransactionsCSV = (coin) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      coin,
      rpc2cli: Config.rpc2cli,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/shepherd/electrum/listtransactions/csv${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          'shepherdElectrumTransactionsCSV',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}