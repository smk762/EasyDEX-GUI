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
    //<option value="ANC|full">AnonCoin (ANC)</option>
    //<option value="MZC|full">MazaCoin (MZC)</option>
    //<option value="SYS|full">SysCoin (SYS)</option>
    return (
      <optgroup label="Crypto Currencies">
        <option value="BTCD|full" className={ this.state.nativeOnly ? 'hide' : '' }>BitcoinDark (BTCD)</option>
        <option value="BTC|full|basilisk" className={ this.state.nativeOnly ? 'hide' : '' }>Bitcoin (BTC)</option>
        <option value="BTM|full" className={ this.state.nativeOnly ? 'hide' : '' }>Bitmark (BTM)</option>
        <option value="CARB|full" className={ this.state.nativeOnly ? 'hide' : '' }>Carboncoin (CARB)</option>
        <option value="DGB|full" className={ this.state.nativeOnly ? 'hide' : '' }>Digibyte (DGB)</option>
        <option value="DOGE|full" className={ this.state.nativeOnly ? 'hide' : '' }>Dogecoin (DOGE)</option>
        <option value="FRK|full" className={ this.state.nativeOnly ? 'hide' : '' }>Franko (FRK)</option>
        <option value="GAME|full" className={ this.state.nativeOnly ? 'hide' : '' }>Gamecredits (GAME)</option>
        <option value="KMD|basilisk|native">Komodo (KMD)</option>
        <option value="LTC|full" className={ this.state.nativeOnly ? 'hide' : '' }>Litecoin (LTC)</option>
        <option value="UNO|full" className={ this.state.nativeOnly ? 'hide' : '' }>Unobtanium (UNO)</option>
        <option value="ZEC|full" className={ this.state.nativeOnly ? 'hide' : '' }>Zcash (ZEC)</option>
        <option value="ZET|full" className={ this.state.nativeOnly ? 'hide' : '' }>Zetacoin (ZET)</option>
      </optgroup>
    );
  }
}

export default AddCoinOptionsCrypto;
