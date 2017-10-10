import React from 'react';
import { translate } from '../../translate/translate';

class AddCoinOptionsCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
      isExperimentalOn: false,
    };
  }

  componentWillMount() {
    let appConfig;

    try {
      appConfig = window.require('electron').remote.getCurrentWindow().appConfig;
    } catch (e) {}

    this.setState({
      isExperimentalOn: appConfig.experimentalFeatures,
    });
  }

  render() {
    return (
      <optgroup label={ translate('ADD_COIN.CRYPTO_CURRENCIES') }>
        <option value="KMD|native|spv">Komodo (KMD)</option>
        <option
          value="CHIPS|native|spv"
          className={ this.state.isExperimentalOn ? '' : 'hide' }>Chips (CHIPS)</option>
      </optgroup>
    );
  }
}

export default AddCoinOptionsCrypto;
