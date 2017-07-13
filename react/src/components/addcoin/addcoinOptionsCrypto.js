import React from 'react';
import { translate } from '../../translate/translate';
import { Config } from '../../actions/actionCreators';

class AddCoinOptionsCrypto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nativeOnly: Config.iguanaLessMode,
    }
  }

  render() {
    const isWindows = this.props.appSettings && this.props.appSettings.appInfo && this.props.appSettings.appInfo.sysInfo && this.props.appSettings.appInfo.sysInfo.platform === 'win32';

    //<option value="ANC|full">AnonCoin (ANC)</option>
    //<option value="MZC|full">MazaCoin (MZC)</option>
    //<option value="SYS|full">SysCoin (SYS)</option>
    return (
      <optgroup label={ translate('ADD_COIN.CRYPTO_CURRENCIES') }>
        <option
          value="BTCD|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>BitcoinDark (BTCD)</option>
        <option
          value="BTC|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Bitcoin (BTC)</option>
        <option
          value="BTM|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Bitmark (BTM)</option>
        <option
          value="CARB|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Carboncoin (CARB)</option>
        <option
          value="DGB|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Digibyte (DGB)</option>
        <option
          value="DOGE|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Dogecoin (DOGE)</option>
        <option
          value="FRK|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Franko (FRK)</option>
        <option
          value="GAME|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Gamecredits (GAME)</option>
        <option value="KMD|basilisk|native">Komodo (KMD)</option>
        <option
          value="LTC|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Litecoin (LTC)</option>
        <option
          value="UNO|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Unobtanium (UNO)</option>
        <option
          value="ZEC|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Zcash (ZEC)</option>
        <option
          value="ZET|full"
          className={ this.state.nativeOnly || isWindows ? 'hide' : '' }>Zetacoin (ZET)</option>
      </optgroup>
    );
  }
}

export default AddCoinOptionsCrypto;
