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
  checkForUpdateUIPromise,
  updateUIPromise,
  triggerToaster,
} from '../../../actions/actionCreators';
import Store from '../../../store';

import {
  SettingsRender,
} from './settings.render';

import AppUpdateTab from  './settings.appUpdateTab';
import AppInfoTab from  './settings.appInfoTab';
import WalletInfoTab from './settings.walletInfo';
import AddNodeTab from './settings.addNodeTab';
import WalletBackupTab from './settings.walletBackupTab';
import FiatCurrencyTab from './settings.fiatCurrency';
import ExportKeysTab from './settings.exportKeys';
import ImportKeysTab from './settings.importKeys';
import DebugLogPanel from './settings.debugLogPanel';
import AppSettingsPanel from './settings.appSettings';
import CliPanel from './settings.cliPanel';
import SupportPanel from './settings.supportPanel';

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

const socket = io.connect(`http://127.0.0.1:${Config.agamaPort}`);
let updateProgressBar = {
  patch: -1,
};

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
      updatePatch: null,
      updateBins: null,
      updateLog: [],
      updateProgressPatch: null,
      disableWalletSpecificUI: false,
    };
    this.updateInput = this.updateInput.bind(this);
    this._checkForUpdateUIPromise = this._checkForUpdateUIPromise.bind(this);
    this._updateUIPromise = this._updateUIPromise.bind(this);
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
    socket.on('patch', msg => this.updateSocketsData(msg));
    window.addEventListener('resize', this.updateTabDimensions);
  }

  componentWillUnmount() {
    socket.removeAllListeners('patch', msg => this.updateSocketsData(msg));
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

  updateSocketsData(data) {
    if (data &&
        data.msg &&
        data.msg.type === 'ui') {

      if (data.msg.status === 'progress' &&
          data.msg.progress &&
          data.msg.progress < 100) {
        this.setState(Object.assign({}, this.state, {
          updateProgressPatch: data.msg.progress,
        }));
        updateProgressBar.patch = data.msg.progress;
      } else {
        if (data.msg.status === 'progress' &&
            data.msg.progress &&
            data.msg.progress === 100) {
          let _updateLog = [];
          _updateLog.push(`${translate('INDEX.UI_UPDATE_DOWNLOADED')}...`);
          this.setState(Object.assign({}, this.state, {
            updateLog: _updateLog,
          }));
          updateProgressBar.patch = 100;
        }

        if (data.msg.status === 'done') {
          let _updateLog = [];
          _updateLog.push(translate('INDEX.UI_UPDATED'));
          this.setState(Object.assign({}, this.state, {
            updateLog: _updateLog,
            updatePatch: null,
          }));
          updateProgressBar.patch = -1;
        }

        if (data.msg.status === 'error') {
          let _updateLog = [];
          _updateLog.push(translate('INDEX.UI_UPDATE_ERROR'));
          this.setState(Object.assign({}, this.state, {
            updateLog: _updateLog,
          }));
          updateProgressBar.patch = -1;
        }
      }
    } else {
      if (data &&
          data.msg) {
        let _updateLog = this.state.updateLog;
        _updateLog.push(data.msg);
        this.setState(Object.assign({}, this.state, {
          updateLog: _updateLog,
        }));
      }
    }
  }

  _checkForUpdateUIPromise() {
    let _updateLog = [];
    _updateLog.push(translate('INDEX.CHECKING_UI_UPDATE'));
    this.setState(Object.assign({}, this.state, {
      updateLog: _updateLog,
    }));

    checkForUpdateUIPromise()
    .then((res) => {
      let _updateLog = this.state.updateLog;
      _updateLog.push(res.result === 'update' ? (`${translate('INDEX.NEW_UI_UPDATE')} ${res.version.remote}`) : translate('INDEX.YOU_HAVE_LATEST_UI'));
      this.setState(Object.assign({}, this.state, {
        updatePatch: res.result === 'update' ? true : false,
        updateLog: _updateLog,
      }));
    });
  }

  _updateUIPromise() {
    updateProgressBar.patch = 0;
    let _updateLog = [];
    _updateLog.push(`${translate('INDEX.DOWNLOADING_UI_UPDATE')}...`);
    this.setState(Object.assign({}, this.state, {
      updateLog: _updateLog,
    }));

    updateUIPromise();
  }

  renderUpdateStatus() {
    let items = [];
    let patchProgressBar = null;
    const _updateLogLength = this.state.updateLog.length;

    for (let i = 0; i < _updateLogLength; i++) {
      items.push(
        <div key={ `settings-update-log-${i}` }>{ this.state.updateLog[i] }</div>
      );
    }

    if (_updateLogLength) {
      return (
        <div style={{ minHeight: '200px' }}>
          <hr />
          <h5>{ translate('SETTINGS.PROGRESS') }:</h5>
          <div className="padding-bottom-15">{ items }</div>
          <div className={ updateProgressBar.patch > -1 ? 'progress progress-sm' : 'hide' }>
            <div
              className="progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success font-size-80-percent"
              style={{ width: `${updateProgressBar.patch}%` }}>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
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
      return <AppInfoTab />
    }

    return null;
  }

  renderAppUpdateTab() {
    return <AppUpdateTab />
  }

  renderWalletInfo() {
    return <WalletInfoTab />
  }
  renderAddNode() {
    return <AddNodeTab />
  }

  renderWalletBackup() {
    return <WalletBackupTab />
  }

  renderFiatCurrency() {
    return <FiatCurrencyTab />
  }

  renderExportKeys() {
    return <ExportKeysTab />
  }

  renderImportKeys() {
    return <ImportKeysTab />
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
