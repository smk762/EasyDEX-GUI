import React from 'react';
import { translate } from '../../translate/translate';
import mainWindow from '../../util/mainWindow';

class AddCoinOptionsCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
      isExperimentalOn: false,
    };
  }

  componentWillMount() {
    const appConfig = mainWindow.appConfig;

    this.setState({
      isExperimentalOn: appConfig.experimentalFeatures,
    });
  }

  render() {
    let availableKMDModes = mainWindow.arch === 'x64' ? 'native|spv' : 'spv';

    return (
      <optgroup label={ translate('ADD_COIN.CRYPTO_CURRENCIES') }>
        <option value={ `KMD|${availableKMDModes}` }>Komodo (KMD)</option>
        <option
          value="CHIPS|spv"
          className={ this.state.isExperimentalOn ? '' : 'hide' }>Chips (CHIPS)</option>
      </optgroup>
    );
  }
}

export default AddCoinOptionsCrypto;
