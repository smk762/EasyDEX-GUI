import React from 'react';
import WalletMain from './walletMain';
import Store from '../../store';
import { translate } from '../../translate/translate';
import {
  getDexCoins,
  activeHandle,
  triggerToaster,
  shepherdElectrumCoins,
  toggleZcparamsFetchModal,
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
    let zcashParamsExist;
    let appConfig;

    try {
      appVersion = window.require('electron').remote.getCurrentWindow().appBasicInfo;
      appConfig = window.require('electron').remote.getCurrentWindow().appConfig;
      zcashParamsExist = window.require('electron').remote.getCurrentWindow().zcashParamsExist;
    } catch (e) {}

    if (appVersion) {
      document.title = `${appVersion.name} (v${appVersion.version.replace('version=', '')}-beta)`;
    }

    console.warn(zcashParamsExist);
    // TODO: isolate check only when komodod is detected
    if (zcashParamsExist.errors) {
      let _errors = [translate('KMD_NATIVE.ZCASH_PARAMS_MISSING'), ''];

      if (!zcashParamsExist.rootDir) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_ROOT_DIR'));
      }
      if (!zcashParamsExist.provingKey) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_PROVING_KEY'));
      }
      if (!zcashParamsExist.verifyingKey) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_VERIFYING_KEY'));
      }
      if (!zcashParamsExist.provingKeySize &&
          zcashParamsExist.provingKey) {
        _errors.push(translate('KMD_NATIVE.ZCASH_PARAMS_MISSING_PROVING_KEY_SIZE'));
      }
      if (!zcashParamsExist.verifyingKeySize &&
          zcashParamsExist.verifyingKey) {
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
      Store.dispatch(toggleZcparamsFetchModal(true));
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
