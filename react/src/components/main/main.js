import React from 'react';
import WalletMain from './walletMain';
import Store from '../../store';
import {
  getDexCoins,
  activeHandle,
  shepherdElectrumCoins,
} from '../../actions/actionCreators';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: null,
    };
  }

  componentDidMount() {
    let appVersion;
    let appConfig;

    try {
      appVersion = window.require('electron').remote.getCurrentWindow().appBasicInfo;
      appConfig = window.require('electron').remote.getCurrentWindow().appConfig;
    } catch (e) {}

    if (appVersion) {
      document.title = `${appVersion.name} (v${appVersion.version.replace('version=', '')}-beta)`;
    }
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
