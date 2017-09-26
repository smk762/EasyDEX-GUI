import React from 'react';
import { translate } from '../../translate/translate';
import Config from '../../config';

class AddCoinOptionsCrypto extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <optgroup label={ translate('ADD_COIN.CRYPTO_CURRENCIES') }>
        <option value="KMD|native">Komodo (KMD)</option>
        <option value="CHIPS|native">Chips (CHIPS)</option>
      </optgroup>
    );
  }
}

export default AddCoinOptionsCrypto;
