import React from 'react';
import { connect } from 'react-redux';
import { translate } from '../../translate/translate';
import Config from '../../config';

class AddCoinOptionsCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
      nativeOnly: Config.iguanaLessMode,
    }
  }

  render() {
    // const isWindows = this.props.appSettings && this.props.appSettings.appInfo && this.props.appSettings.appInfo.sysInfo && this.props.appSettings.appInfo.sysInfo.platform === 'win32';
    let appConfig;

    try {
      appConfig = window.require('electron').remote.getCurrentWindow().appConfig;
    } catch (e) {}

    return (
      <optgroup label={ translate('ADD_COIN.CRYPTO_CURRENCIES') }>
        <option
          value="ANC|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>AnonCoin (ANC)</option>
        <option
          value="BTCD|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>BitcoinDark (BTCD)</option>
        <option
          value="BTC|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Bitcoin (BTC)</option>
        <option
          value="BTM|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Bitmark (BTM)</option>
        <option
          value="CARB|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Carboncoin (CARB)</option>
        <option
          value="DGB|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Digibyte (DGB)</option>
        <option
          value="DOGE|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Dogecoin (DOGE)</option>
        <option
          value="FRK|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Franko (FRK)</option>
        <option
          value="GAME|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Gamecredits (GAME)</option>
        <option value="KMD|basilisk|native">Komodo (KMD)</option>
        <option
          value="MZC|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>MazaCoin (MZC)</option>
        <option
          value="LTC|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Litecoin (LTC)</option>
        <option
          value="SYS|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>SysCoin (SYS)</option>
        <option
          value="UNO|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Unobtanium (UNO)</option>
        <option
          value="ZEC|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Zcash (ZEC)</option>
        <option
          value="ZET|full"
          className={ this.state.nativeOnly || !appConfig.experimentalFeatures ? 'hide' : '' }>Zetacoin (ZET)</option>
      </optgroup>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    appSettings:  state.appSettings,
  };
};

export default connect(mapStateToProps)(AddCoinOptionsCrypto);
