import React from 'react';
import { translate } from '../../translate/translate';

class AddCoinOptionsAC extends React.Component {
  render() {
    const _assetChains = [
      'bet',
      'bots',
      'ceal',
      'coqui',
      'crypto',
      'hodl',
      'dex',
      'jumblr',
      'kv',
      'mgw',
      //'mvp',
      'pangea',
      'revs',
      'shark',
      'supernet',
    ];
    let _items = [];

    for (let i = 0; i < _assetChains.length; i++) {
      _items.push(
        <option
          key={ _assetChains[i] }
          value={ `${_assetChains[i].toUpperCase()}|basilisk|native` }>{ translate(`ASSETCHAINS.${_assetChains[i].toUpperCase()}`) }</option>
      );
    }

    return (
      <optgroup label={ translate('ADD_COIN.ASSETCHAINS') }>
      { _items }
      </optgroup>
    );
  }
}

export default AddCoinOptionsAC;
