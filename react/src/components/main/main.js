import React from 'react';
import WalletMain from './walletMain';
import Store from '../../store';
import {
  getDexCoins,
  activeHandle,
  shepherdElectrumCoins,
} from '../../actions/actionCreators';
import mainWindow from '../../util/mainWindow';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: null,
    };
  }

  componentDidMount() {
    const appVersion = mainWindow.appBasicInfo;
    const appConfig = mainWindow.appConfig;

    if (appVersion) {
      document.title = `${appVersion.name} (v${appVersion.version.replace('version=', '')}${mainWindow.arch === 'x64' ? '' : '-32bit'}-beta)`;
    }

    console.warn(mainWindow.getAssetChainPorts());
  }

  componentWillMount() {
    Store.dispatch(getDexCoins());
    Store.dispatch(activeHandle());
    Store.dispatch(shepherdElectrumCoins());
  }

  render() {
    return (
      <WalletMain />
    );
  }
}

export default Main;
