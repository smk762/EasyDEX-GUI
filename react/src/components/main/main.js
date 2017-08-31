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
    let appConfig;

    try {
      appVersion = window.require('electron').remote.getCurrentWindow().appBasicInfo;
      appConfig = window.require('electron').remote.getCurrentWindow().appConfig;
      zcashParamsExist = window.require('electron').remote.getCurrentWindow().zcashParamsExist;
    } catch (e) {}

    if (appVersion) {
      const _appMode = `${appConfig.iguanaLessMode ? ' - ' + translate('INDEX.NATIVE_ONLY_MODE') : ' - ' + translate('INDEX.NORMAL_MODE')}`;
      document.title = `${appVersion.name} (v${appVersion.version.replace('version=', '')}-beta)${_appMode}`;
    }

    if (zcashParamsExist.errors) {
      let _errors = [translate('KMD_NATIVE.ZCASH_PARAMS_MISSING'), ''];

      if (!zcashParamsExist.rootDir) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_ROOT_DIR'));
      }
      if (!zcashParamsExist.provingKey) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_PROVING_KEY'));
      }
      if (!zcashParamsExist.provingKey) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_VERIFYING_KEY'));
      }
      if (!zcashParamsExist.provingKeySize) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_PROVING_KEY_SIZE'));
      }
      if (!zcashParamsExist.verifyingKeySize) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_VERIFYING_KEY_SIZE'));
      }

      Store.dispatch(
        triggerToaster(
          _errors,
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
      <WalletMain />
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
