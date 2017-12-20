import { translate } from '../../translate/translate';
import mainWindow from '../../util/mainWindow';

const addCoinOptionsCrypto = () => {
  const availableKMDModes = mainWindow.arch === 'x64' ? 'spv|native' : 'spv';

  let _coins = [{
    label: 'Komodo (KMD)',
    icon: 'KMD',
    value: `KMD|${availableKMDModes}`,
  },
  {
    label: 'Chips (CHIPS)',
    icon: 'CHIPS',
    value: `CHIPS|spv`,
  }];

  if (mainWindow.argv.indexOf('spvcoins=all') > -1) {
    _coins.push({
      label: 'BitcoinGold (BTG)',
      icon: 'BTG',
      value: `BTG|spv`,
    }, {
      label: 'BitcoinCash (BCH)',
      icon: 'BCH',
      value: `BCH|spv`,
    },/* {
      label: 'Bitcoin (BTC)',
      icon: 'BTC',
      value: `BTC|spv`,
    }, */{
      label: 'Crown (CRW)',
      icon: 'CRW',
      value: `CRW|spv`,
    }, {
      label: 'Dash (DASH)',
      icon: 'DASH',
      value: `DASH|spv`,
    }, {
      label: 'DigiByte (DGB)',
      icon: 'DGB',
      value: `DGB|spv`,
    }, {
      label: 'Faircoin (FAIR)',
      icon: 'FAIR',
      value: `FAIR|spv`,
    }, {
      label: 'Argentum (ARG)',
      icon: 'ARG',
      value: `ARG|spv`,
    }, {
      label: 'Litecoin (LTC)',
      icon: 'LTC',
      value: `LTC|spv`,
    }, {
      label: 'Monacoin (MONA)',
      icon: 'MONA',
      value: `MONA|spv`,
    }, {
      label: 'Namecoin (NMC)',
      icon: 'NMC',
      value: `NMC|spv`,
    }, {
      label: 'Vertcoin (VTC)',
      icon: 'VTC',
      value: `VTC|spv`,
    }, {
      label: 'Viacoin (VIA)',
      icon: 'VIA',
      value: `VIA|spv`,
    }, {
      label: 'Sibcoin (SIB)',
      icon: 'SIB',
      value: `SIB|spv`,
    },/* {
      label: 'Blackcoin (BLK)',
      icon: 'BLK',
      value: `BLK|spv`,
    }, */{
      label: 'Dogecoin (DOGE)',
      icon: 'DOGE',
      value: `DOGE|spv`,
    });
  }

  return _coins;
}

export default addCoinOptionsCrypto;
