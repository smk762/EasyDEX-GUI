import React from 'react';
import { translate } from '../../translate/translate';

class AddCoinOptionsACFiat extends React.Component {
  render() {
    const _fiat = [
      'aud',
      'brl',
      'gbp',
      'bgn',
      'cad',
      'hrk',
      'czk',
      'cny',
      'dkk',
      'eur',
      'hkd',
      'huf',
      'inr',
      'idr',
      'ils',
      'jpy',
      'krw',
      'myr',
      'mxn',
      'nzd',
      'nok',
      'php',
      'pln',
      'ron',
      'rub',
      'sgd',
      'zar',
      'sek',
      'chf',
      'thb',
      'try',
      'usd'
    ];
    let _items = [];

    for (let i = 0; i < _fiat.length; i++) {
      _items.push(
        <option value={ `${_fiat[i].toUpperCase()}|basilisk|native` }>{ translate(`FIAT_CURRENCIES.${_fiat[i].toUpperCase()}`) }</option>
      );
    }

    return (
      <optgroup label={ translate('ADD_COIN.FIAT_CURRENCIES') }>
      { _items }
      </optgroup>
    );
  }
}

export default AddCoinOptionsACFiat;
