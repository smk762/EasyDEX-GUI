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
      activeTabHeight: '0',
      tabElId: null,
      seedInputVisibility: false,
      nativeOnly: Config.iguanaLessMode,
      disableWalletSpecificUI: false,
    };
    this.updateInput = this.updateInput.bind(this);
    this.updateTabDimensions = this.updateTabDimensions.bind(this);
  }

  updateTabDimensions() {
    setTimeout(() => {
      if(document.querySelector(`#${this.state.tabElId} .panel-collapse .panel-body`)){
      const _height = document.querySelector(`#${this.state.tabElId} .panel-collapse .panel-body`).offsetHeight;
      } else {
        _height = '100%';
      }
      this.setState(Object.assign({}, this.state, {
        activeTabHeight: _height,
      }));
    }, 100);
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateTabDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateTabDimensions);

    if (!this.state.disableWalletSpecificUI) {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    }
  }

  componentDidMount(props) {
    if (!this.props.disableWalletSpecificUI) {
      Store.dispatch(iguanaActiveHandle());
    }

    Store.dispatch(getAppConfig());
    Store.dispatch(getAppInfo());
  }

  componentWillReceiveProps(props) {
    if (this.state.tabElId) {
      const _height = document.querySelector(`#${this.state.tabElId} .panel-collapse .panel-body`).offsetHeight;

      this.setState(Object.assign({}, this.state, {
        activeTab: this.state.activeTab,
        activeTabHeight: _height,
        tabElId: this.state.tabElId,
        disableWalletSpecificUI: this.props.disableWalletSpecificUI,
      }));
    }
  }

  openTab(elemId, tab) {
    setTimeout(() => {
      const _height = document.querySelector(`#${elemId} .panel-collapse .panel-body`).offsetHeight;

      this.setState(Object.assign({}, this.state, {
        activeTab: tab,
        activeTabHeight: _height,
        tabElId: elemId,
      }));

      // body size hack
      if (!this.state.disableWalletSpecificUI) {
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';

        setTimeout(() => {
          document.documentElement.style.height = _height <= 200 ? '100%' : 'inherit';
          document.body.style.height = _height <= 200 ? '100%' : 'inherit';
        }, 100);
      }
    }, 100);
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

  updateInput(e) {
      this.setState({
        [e.target.name]: e.target.value,
      });
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
