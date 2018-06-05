import translate from '../../translate/translate';
import mainWindow from '../../util/mainWindow';
import config from '../../config';
import { cryptoCoins } from '../../util/coinHelper';

let _prepCoinsList;
let coins = cryptoCoins;

const prepCoinsList = () => {
  const availableKMDModes = mainWindow.arch === 'x64' ? 'spv|native' : 'spv';
  let _coins = [];

  if (!config.experimentalFeatures) {
    coins = coins.slice(0, 2);
  }

  for (let i = 0; i < coins.length; i++) {
    _coins.push({
      label: `${translate('CRYPTO.' + coins[i])} (${coins[i]})`,
      icon: coins[i],
      value: `${coins[i]}|${coins[i] === 'KMD' ? availableKMDModes : 'spv'}`,
    });
  }

  for (let j = 0; j < 2; j++) { // run twice
    for (let i = 0; i < _coins.length; i++) {
      if (!mainWindow.electrumServers[_coins[i].icon.toLowerCase()]) {
        _coins.splice(i, 1);
      }
    }
  }

  _prepCoinsList = _coins;

  return _coins;
};

const addCoinOptionsCrypto = () => {
  if (_prepCoinsList) {
    return _prepCoinsList;
  } else {
    return prepCoinsList();
  }
}

export default addCoinOptionsCrypto;