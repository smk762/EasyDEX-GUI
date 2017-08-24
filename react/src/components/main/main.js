import React from 'react';
import WalletMain from './walletMain';
import { iguanaSetRPCAuth } from '../../util/auth';
import Store from '../../store';
import { translate } from '../../translate/translate';
import {
  Config,
  getDexCoins,
  iguanaActiveHandle,
  triggerToaster
} from '../../actions/actionCreators';

const IGUANA_ACTIVE_HANDLE_TIMEOUT = 30000;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.isWalletUnlocked = this.isWalletUnlocked.bind(this);
    this.state = {
      isLoggedIn: false,
      coins: null,
      activeCoins: false,
      activeHandleInterval: null,
    };
  }

  componentDidMount() {
    let appVersion;
    let zcashParamsExist;

    try {
      appVersion = window.require('electron').remote.getCurrentWindow().appBasicInfo;
      zcashParamsExist = window.require('electron').remote.getCurrentWindow().zcashParamsExist;
    } catch (e) {}

    if (appVersion) {
      document.title = `${appVersion.name} (v${appVersion.version.replace('version=', '')}-beta)`;
    }

    if (!zcashParamsExist) {
      Store.dispatch(
        triggerToaster(
          translate('KMD_NATIVE.ZCASH_PARAMS_MISSING'),
          'Komodo',
          'error',
          false
        )
      );
    }

    Store.dispatch(iguanaActiveHandle());
    const _iguanaActiveHandle = setInterval(function() {
      Store.dispatch(iguanaActiveHandle());
    }, IGUANA_ACTIVE_HANDLE_TIMEOUT);

    this.setState(Object.assign({}, this.state, {
      activeHandleInterval: _iguanaActiveHandle,
    }));
  }

  componentWillMount() {
    // set userpass param
    Store.dispatch(getDexCoins());
    iguanaSetRPCAuth();
  }

  isWalletUnlocked() {
    return (
      <WalletMain {...this.props} />
    );
  }

  render() {
    return (
      <div>
        { this.isWalletUnlocked() }
      </div>
    );
  }
}

export default Main;
