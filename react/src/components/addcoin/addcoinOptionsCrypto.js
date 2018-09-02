import translate from '../../translate/translate';
import mainWindow from '../../util/mainWindow';
import config from '../../config';
import { cryptoCoins } from '../../util/coinHelper';

let _prepCoinsList;
let coins = cryptoCoins;
let _activeCoins;

const prepCoinsList = (filterActiveCoins) => {
  const availableKMDModes = mainWindow.arch === 'x64' ? 'spv|native' : 'spv';
  let _coins = [];

  if (!config.experimentalFeatures) {
    coins = coins.slice(0, 2);
  }

  if (filterActiveCoins) {
    for (let i = 0; i < _prepCoinsList.length; i++) {
      if (_activeCoins.spv.indexOf(_prepCoinsList[i].icon.toUpperCase()) === -1 &&
          _activeCoins.native.indexOf(_prepCoinsList[i].icon.toUpperCase()) === -1) {
        _coins.push(_prepCoinsList[i]);
      }
    }
  } else {
    for (let i = 0; i < coins.length; i++) {
      if (mainWindow.electrumServers[coins[i].toLowerCase()] &&
          _activeCoins.spv.indexOf(coins[i].toUpperCase()) === -1 &&
          _activeCoins.native.indexOf(coins[i].toUpperCase()) === -1) {
        _coins.push({
          label: `${translate('CRYPTO.' + coins[i])} (${coins[i]})`,
          icon: coins[i],
          value: `${coins[i]}|${coins[i] === 'KMD' ? availableKMDModes : 'spv'}`,
        });
      }
    }
  }

  _prepCoinsList = _coins;

  return _coins;
};

const addCoinOptionsCrypto = (activeCoins) => {
  _activeCoins = activeCoins;

  if (_prepCoinsList) {
    return prepCoinsList();
  } else {
    return prepCoinsList();
  }
}

export default addCoinOptionsCrypto;