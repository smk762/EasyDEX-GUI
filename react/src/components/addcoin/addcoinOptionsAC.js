import translate from '../../translate/translate';
import mainWindow from '../../util/mainWindow';
import config from '../../config';
import { kmdAssetChains } from 'agama-wallet-lib/src/coin-helpers';
import { sortObject } from '../../util/coinHelper';

// sort coins by their title
let coinsList = [];
let _coins = {};

for (let i = 0; i < kmdAssetChains.length; i++) {
  _coins[translate('ASSETCHAINS.' + kmdAssetChains[i].toUpperCase())] = kmdAssetChains[i];
}

_coins = sortObject(_coins);

for (let key in _coins) {
  coinsList.push(_coins[key]);
}

const addCoinOptionsAC = (activeCoins) => {
  let _assetChains;
  let _items = [];

  _assetChains = coinsList;

  for (let i = 0; i < _assetChains.length; i++) {
    let availableModes = _assetChains[i] !== 'AXO' && _assetChains[i] !== 'ETOMIC' && _assetChains[i] !== 'MESH' && _assetChains[i] !== 'CEAL' && _assetChains[i] !== 'DSEC' ? 'spv|native' : 'native';

    if (mainWindow.arch !== 'x64') {
      availableModes = 'spv';
    }

    if (_assetChains[i] !== 'MVP' &&
        _assetChains[i] !== 'VRSC' &&
        (activeCoins &&
         activeCoins.spv &&
         activeCoins.native &&
         activeCoins.spv.indexOf(_assetChains[i].toUpperCase()) === -1 &&
         activeCoins.native.indexOf(_assetChains[i].toUpperCase()) === -1)) {
      _items.push({
        label: `${translate(`ASSETCHAINS.${_assetChains[i].toUpperCase()}`)}${translate(`ASSETCHAINS.${_assetChains[i].toUpperCase()}`).indexOf('(') === -1 && translate(`ASSETCHAINS.${_assetChains[i].toUpperCase()}`) !== _assetChains[i].toUpperCase() ? ' (' + _assetChains[i].toUpperCase() + ')' : ''}`,
        icon: _assetChains[i].toLowerCase(),
        value: `${_assetChains[i].toUpperCase()}|${availableModes}`,
      });
    }
  }

  if (config.experimentalFeatures) {
    const _customAssetChains = {
      mining: [
      ],
      staking: [
      ],
    };

    for (let key in _customAssetChains) {
      for (let i = 0; i < _customAssetChains[key].length; i++) {
        _items.push({
          label: `${translate(`ASSETCHAINS.${_customAssetChains[key][i].toUpperCase()}`)}${translate(`ASSETCHAINS.${_customAssetChains[key][i].toUpperCase()}`).indexOf('(') === -1 && translate(`ASSETCHAINS.${_customAssetChains[key][i].toUpperCase()}`) !== _customAssetChains[key][i].toUpperCase() ? ' (' + _customAssetChains[key][i].toUpperCase() + ')' : ''}`,
          icon: _customAssetChains[key][i].toLowerCase(),
          value: `${_customAssetChains[key][i].toUpperCase()}|${key}`,
        });
      }
    }
  }

  return _items;
}

export default addCoinOptionsAC;