import React from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../translate/translate';
import Config from '../../../config';
import {
  iguanaActiveHandle,
  getAppConfig,
  getPeersList,
  addPeerNode,
  getAppInfo,
  shepherdCli,
  triggerToaster,
} from '../../../actions/actionCreators';
import Store from '../../../store';

import { secondsToString } from '../../../util/time';
import {
  SettingsRender,
} from './settings.render';

import AppUpdatePanel from  './settings.appUpdatePanel';
import AppInfoPanel from  './settings.appInfoPanel';
import AddNodePanel from './settings.addNodePanel';
import AppSettingsPanel from './settings.appSettingsPanel';
import CliPanel from './settings.cliPanel';
import DebugLogPanel from './settings.debugLogPanel';
import FiatCurrencyPanel from './settings.fiatCurrencyPanel';
import ExportKeysPanel from './settings.exportKeysPanel';
import ImportKeysPanel from './settings.importKeysPanel';
import SupportPanel from './settings.supportPanel';
import WalletInfoPanel from './settings.walletInfoPanel';
import WalletBackupPanel from './settings.walletBackupPanel';

/*
  TODO:
  1) pre-select active coin in add node tab
  2) add fiat section
  3) kickstart section
  4) batch export/import wallet addresses
*/
class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 0,
      tabElId: null,
      seedInputVisibility: false,
      nativeOnly: Config.iguanaLessMode,
      disableWalletSpecificUI: false,
      appRuntimeLog: [],
      toggleAppRuntimeLog: false,
    };
    this.updateInput = this.updateInput.bind(this);
    this.getAppRuntimeLog = this.getAppRuntimeLog.bind(this);
    this.toggleAppRuntimeLog = this.toggleAppRuntimeLog.bind(this);
    this.renderAppRuntimeLog = this.renderAppRuntimeLog.bind(this);
  }

  renderAppRuntimeLog() {
    let _items = [];
    const _appRuntimeLog = this.state.appRuntimeLog;

    for (let i = 0; i < _appRuntimeLog.length; i++) {
      _items.push(
        <p key={ `app-runtime-log-entry-${i}` }>
          <span>{ secondsToString(_appRuntimeLog[i].time, true) }</span>
          <span className="padding-left-30">{ JSON.stringify(_appRuntimeLog[i].msg, null, '').replace('\\n', ' ') }</span>
        </p>
      );
    }

    return _items;
  }

  toggleAppRuntimeLog() {
    this.setState(Object.assign({}, this.state, {
      toggleAppRuntimeLog: !this.state.toggleAppRuntimeLog,
    }));

    this.getAppRuntimeLog();
  }

  getAppRuntimeLog() {
    let _appRuntimeLog;

    try {
      _appRuntimeLog = window.require('electron').remote.getCurrentWindow().getAppRuntimeLog;
    } catch (e) {}

    _appRuntimeLog()
    .then((json) => {
      this.setState(Object.assign({}, this.state, {
        appRuntimeLog: json,
      }));
    });
  }

  componentDidMount(props) {
    if (!this.props.disableWalletSpecificUI) {
      Store.dispatch(iguanaActiveHandle());
    }

    Store.dispatch(getAppConfig());
    Store.dispatch(getAppInfo());

    document.getElementById('section-iguana-wallet-settings').setAttribute("style", "height:auto; min-height: 100%");
  }

  componentWillReceiveProps(props) {
    if (this.state.tabElId) {
      this.setState(Object.assign({}, this.state, {
        activeTab: this.state.activeTab,
        tabElId: this.state.tabElId,
        disableWalletSpecificUI: this.props.disableWalletSpecificUI,
      }));
    }
  }

  openTab(elemId, tab) {
       this.setState(Object.assign({}, this.state, {
        activeTab: tab,
        tabElId: elemId,
      }));

  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
 
  renderAppInfoTab() {
    const releaseInfo = this.props.Settings.appInfo && this.props.Settings.appInfo.releaseInfo;

    if (releaseInfo) {
      return <AppInfoPanel />
    }

    return null;
  }

  renderAppUpdateTab() {
    return <AppUpdatePanel />
  }

  renderWalletInfo() {
    return <WalletInfoPanel />
  }
  renderAddNode() {
    return <AddNodePanel />
  }

  renderWalletBackup() {
    return <WalletBackupPanel />
  }

  renderFiatCurrency() {
    return <FiatCurrencyPanel />
  }

  renderExportKeys() {
    return <ExportKeysPanel />
  }

  renderImportKeys() {
    return <ImportKeysPanel />
  }

  renderDebugLog() {
    return <DebugLogPanel />
  }

  renderAppSettings() {
    return <AppSettingsPanel />
  }
  
  renderCliPanel() {
    return <CliPanel />  
  }

  renderSupportPanel() {
    return <SupportPanel />
  }

  render() {
    return SettingsRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    Main: {
      coins: state.Main.coins,
      activeHandle: state.Main.activeHandle,
    },
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
    },
    Settings: state.Settings,
    Dashboard: state.Dashboard,
  };
};

export default connect(mapStateToProps)(Settings);
