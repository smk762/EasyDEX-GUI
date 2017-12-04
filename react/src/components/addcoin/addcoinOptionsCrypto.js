import React from 'react';
import { translate } from '../../translate/translate';
import mainWindow from '../../util/mainWindow';

class AddCoinOptionsCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    let availableKMDModes = mainWindow.arch === 'x64' ? 'spv|native' : 'spv';

    return (
      <optgroup label={ translate('ADD_COIN.CRYPTO_CURRENCIES') }>
        <option value={ `KMD|${availableKMDModes}` }>Komodo (KMD)</option>
        <option value="CHIPS|spv">Chips (CHIPS)</option>
      </optgroup>
    );
  }
}

export default AddCoinOptionsCrypto;
