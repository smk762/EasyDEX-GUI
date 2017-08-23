import React from 'react';
import { translate } from '../../../translate/translate';
import Config from '../../../config';
import {
  iguanaActiveHandle,
  encryptWallet,
  settingsWifkeyState,
  importPrivKey,
  getDebugLog,
  getPeersList,
  addPeerNode,
  getAppConfig,
  saveAppConfig,
  resetAppConfig,
  getAppInfo,
  shepherdCli,
  checkForUpdateUIPromise,
  updateUIPromise,
} from '../../../actions/actionCreators';
import Store from '../../../store';

import {
  AppInfoTabRender,
  SettingsRender,
  AppUpdateTabRender,
} from './settings.render';

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
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      debugLinesCount: 10,
      debugTarget: 'iguana',
      activeTabHeight: '0',
      appSettings: {},
      appConfigSchema: {},
      tabElId: null,
      cliCmdString: '',
      cliCoin: null,
      cliResponse: null,
      exportWifKeysRaw: false,
      seedInputVisibility: false,
      nativeOnly: Config.iguanaLessMode,
      updatePatch: null,
      updateBins: null,
      updateLog: [],
      updateProgressPatch: null,
      wifkeysPassphrase: '',
      trimPassphraseTimer: null,
      disableWalletSpecificUI: null,
    };
    this.exportWifKeys = this.exportWifKeys.bind(this);
    this.updateInput = this.updateInput.bind(this);
    // this.updateInputSettings = this.updateInputSettings.bind(this);
    this.importWifKey = this.importWifKey.bind(this);
    this.readDebugLog = this.readDebugLog.bind(this);
    this.checkNodes = this.checkNodes.bind(this);
    this.addNode = this.addNode.bind(this);
    this.renderPeersList = this.renderPeersList.bind(this);
    this.renderSNPeersList = this.renderSNPeersList.bind(this);
    this._saveAppConfig = this._saveAppConfig.bind(this);
    this._resetAppConfig = this._resetAppConfig.bind(this);
    this.exportWifKeysRaw = this.exportWifKeysRaw.bind(this);
    this.toggleSeedInputVisibility = this.toggleSeedInputVisibility.bind(this);
    this._checkForUpdateUIPromise = this._checkForUpdateUIPromise.bind(this);
    this._updateUIPromise = this._updateUIPromise.bind(this);
    this.updateTabDimensions = this.updateTabDimensions.bind(this);
  }

  updateTabDimensions() {
    setTimeout(() => {
      const _height = document.querySelector(`#${this.state.tabElId} .panel-collapse .panel-body`).offsetHeight;

      this.setState(Object.assign({}, this.state, {
        activeTabHeight: _height,
      }));
    }, 100);
  }

  componentWillMount() {
    socket.on('patch', msg => this.updateSocketsData(msg));
    window.addEventListener('resize', this.updateTabDimensions);

    try {
      const _appConfigSchema = window.require('electron').remote.getCurrentWindow().appConfigSchema;
      const _appSettings = this.props.Settings.appSettings ? this.props.Settings.appSettings : Object.assign({}, window.require('electron').remote.getCurrentWindow().appConfig);

      this.setState(Object.assign({}, this.state, {
        appConfigSchema: _appConfigSchema,
        appSettings: _appSettings,
      }));

      console.warn(_appSettings);
    } catch(e) {}
  }

  componentWillUnmount() {
    socket.removeAllListeners('patch', msg => this.updateSocketsData(msg));
    window.removeEventListener('resize', this.updateTabDimensions);

    if (!this.state.disableWalletSpecificUI) {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    }
  }

  componentDidMount() {
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
        disableWalletSpecificUI: props.disableWalletSpecificUI,
      }));
    }
  }

  openExternalWindow(url) {
    const remote = window.require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;

    const externalWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      title: `${translate('INDEX.LOADING')}...`,
      icon: remote.getCurrentWindow().iguanaIcon,
    });

    externalWindow.loadURL(url);
    externalWindow.webContents.on('did-finish-load', function() {
      setTimeout(function() {
        externalWindow.show();
      }, 40);
    });
  }

  _resetAppConfig() {
    Store.dispatch(resetAppConfig());
  }

  resizeLoginTextarea() {
    // auto-size textarea
    setTimeout(() => {
      if (this.state.seedInputVisibility) {
        document.querySelector('#wifkeysPassphraseTextarea').style.height = '1px';
        document.querySelector('#wifkeysPassphraseTextarea').style.height = `${(15 + document.querySelector('#wifkeysPassphraseTextarea').scrollHeight)}px`;
      }
    }, 100);
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

    for (let i = 0; i < this.state.updateLog.length; i++) {
      items.push(
        <div key={ `settings-update-log-${i}` }>{ this.state.updateLog[i] }</div>
      );
    }

    if (this.state.updateLog.length) {
      return (
        <div style={{ minHeight: '200px' }}>
          <hr />
          <h5>{ translate('SETTINGS.PROGRESS') }:</h5>
          <div className="padding-bottom-15">{ items }</div>
          <div className={ updateProgressBar.patch > -1 ? 'progress progress-sm' : 'hide' }>
            <div
              className="progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success font-size-80-percent"
              style={{ width: updateProgressBar.patch + '%' }}>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  toggleSeedInputVisibility() {
    this.setState({
      seedInputVisibility: !this.state.seedInputVisibility,
    });
  }

  execCliCmd() {
    Store.dispatch(
      shepherdCli(
        'passthru',
        this.state.cliCoin,
        this.state.cliCmd
      )
    );
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

  exportWifKeys() {
    Store.dispatch(
      encryptWallet(
        this.state.wifkeysPassphrase,
        settingsWifkeyState,
        this.props.ActiveCoin.coin
      )
    );
  }

  importWifKey() {
    Store.dispatch(importPrivKey(this.state.importWifKey));
  }

  readDebugLog() {
    Store.dispatch(
      getDebugLog(
        this.state.debugTarget,
        this.state.debugLinesCount
      )
    );
  }

  checkNodes() {
    if (this.state.getPeersCoin) {
      Store.dispatch(getPeersList(this.state.getPeersCoin.split('|')[0]));
    }
  }

  addNode() {
    if (this.state.addNodeCoin) {
      Store.dispatch(
        addPeerNode(
          this.state.addNodeCoin.split('|')[0],
          this.state.addPeerIP
        )
      );
    }
  }

  renderPeersList() {
    if (this.state.getPeersCoin) {
      const _getPeersCoin = this.state.getPeersCoin;
      const _rawPeers = this.props.Settings.rawPeers;
      const coin = _getPeersCoin.split('|')[0];

      if (_rawPeers &&
          _getPeersCoin &&
          _rawPeers[coin]) {
        return _rawPeers[coin].map((ip) =>
          <div key={ ip }>{ ip }</div>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  renderAppInfoTab() {
    const releaseInfo = this.props.Settings.appInfo && this.props.Settings.appInfo.releaseInfo;

    if (releaseInfo) {
      return AppInfoTabRender.call(this);
    }

    return null;
  }

  renderAppUpdateTab() {
    return AppUpdateTabRender.call(this);
  }

  renderSNPeersList() {
    if (this.state.getPeersCoin) {
      const _getPeersCoin = this.state.getPeersCoin;
      const _supernetPeers = this.props.Settings.supernetPeers;
      const coin = _getPeersCoin.split('|')[0];

      if (_supernetPeers &&
          _getPeersCoin &&
          _supernetPeers[coin]) {
        return _supernetPeers[coin].map((ip) =>
          <div key={ ip }>{ ip }</div>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  updateInputSettings(e, parentKey, childKey) {
    let _appSettings = this.state.appSettings;
    let _appSettingsPrev = Object.assign({}, _appSettings);

    if (!childKey && this.state.appConfigSchema[parentKey].type === 'boolean') {
      _appSettings[parentKey] = typeof _appSettings[parentKey] !== undefined ? !_appSettings[parentKey] : !this.state.appSettings[parentKey];
    } else if (childKey && this.state.appConfigSchema[parentKey][childKey].type === 'boolean') {
      _appSettings[parentKey][childKey] = typeof _appSettings[parentKey][childKey] !== undefined ? !_appSettings[parentKey][childKey] : !this.state.appSettings[parentKey][childKey];
    } else if ((!childKey && this.state.appConfigSchema[parentKey].type === 'number') || (childKey && this.state.appConfigSchema[parentKey][childKey].type === 'number')) {
      if (e.target.value === '') {
        _appSettings[e.target.name] = _appSettingsPrev[e.target.name];
      } else {
        _appSettings[e.target.name] = e.target.value.replace(/[^0-9]+/g, '');
      }
    } else {
      _appSettings[e.target.name] = e.target.value;
    }

    this.setState({
      appSettings: _appSettings,
    });
  }

  _saveAppConfig() {
    const _appSettings = this.state.appSettings;
    let _appSettingsPristine = Object.assign({}, this.props.Settings.appSettings);

    for (let key in _appSettings) {
      if (key.indexOf('__') === -1) {
        _appSettingsPristine[key] = _appSettings[key];
      } else {
        const _nestedKey = key.split('__');
        _appSettingsPristine[_nestedKey[0]][_nestedKey[1]] = _appSettings[key];
      }
    }

    Store.dispatch(saveAppConfig(_appSettingsPristine));
  }

  renderConfigEditForm() {
    let items = [];
    const _appConfig = this.state.appSettings;

    for (let key in _appConfig) {
      if (typeof _appConfig[key] === 'object') {
        if (this.state.appConfigSchema[key].display) {
          items.push(
            <tr key={ `app-settings-${key}` }>
              <td className="padding-15">
                { this.state.appConfigSchema[key].displayName ? this.state.appConfigSchema[key].displayName : key }
                { this.state.appConfigSchema[key].info &&
                  <i
                    className="icon fa-question-circle settings-help"
                    title={ this.state.appConfigSchema[key].info }></i>
                }
              </td>
              <td className="padding-15"></td>
            </tr>
          );

          for (let _key in _appConfig[key]) {
            items.push(
              <tr key={ `app-settings-${key}-${_key}` }>
                <td className="padding-15 padding-left-30">
                  { this.state.appConfigSchema[key][_key].displayName ? this.state.appConfigSchema[key][_key].displayName : _key }
                  { this.state.appConfigSchema[key][_key].info &&
                    <i
                      className="icon fa-question-circle settings-help"
                      title={ this.state.appConfigSchema[key][_key].info }></i>
                  }
                </td>
                <td className="padding-15">
                  { this.state.appConfigSchema[key][_key].type === 'number' &&
                    <input
                      type="number"
                      pattern="[0-9]*"
                      type="text"
                      name={ `${key}__${_key}` }
                      value={ _appConfig[key][_key] }
                      onChange={ (event) => this.updateInputSettings(event, key, _key) } />
                  }
                  { this.state.appConfigSchema[key][_key].type === 'string' &&
                    <input
                      type="text"
                      name={ `${key}__${_key}` }
                      value={ _appConfig[key][_key] }
                      onChange={ (event) => this.updateInputSettings(event, key, _key) } />
                  }
                  { this.state.appConfigSchema[key][_key].type === 'boolean' &&
                    <span className="pointer toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          name={ `${key}__${_key}` }
                          value={ _appConfig[key] }
                          checked={ _appConfig[key][_key] } />
                        <div
                          className="slider"
                          onClick={ (event) => this.updateInputSettings(event, key, _key) }></div>
                      </label>
                    </span>
                  }
                </td>
              </tr>
            );
          }
        }
      } else {
        if (this.state.appConfigSchema[key].display) {
          items.push(
            <tr key={ `app-settings-${key}` }>
              <td className="padding-15">
                { this.state.appConfigSchema[key].displayName ? this.state.appConfigSchema[key].displayName : key }
                { this.state.appConfigSchema[key].info &&
                  <i
                    className="icon fa-question-circle settings-help"
                    title={ this.state.appConfigSchema[key].info }></i>
                }
              </td>
              <td className="padding-15">
                { this.state.appConfigSchema[key].type === 'number' &&
                  <input
                    type="number"
                    pattern="[0-9]*"
                    name={ `${key}` }
                    value={ _appConfig[key] }
                    onChange={ (event) => this.updateInputSettings(event, key) } />
                }
                { this.state.appConfigSchema[key].type === 'string' &&
                  <input
                    type="text"
                    name={ `${key}` }
                    value={ _appConfig[key] }
                    onChange={ (event) => this.updateInputSettings(event, key) } />
                }
                { this.state.appConfigSchema[key].type === 'boolean' &&
                  <span className="pointer toggle">
                    <label className="switch">
                      <input
                        type="checkbox"
                        name={ `${key}` }
                        value={ _appConfig[key] }
                        checked={ _appConfig[key] } />
                      <div
                        className="slider"
                        onClick={ (event) => this.updateInputSettings(event, key) }></div>
                    </label>
                  </span>
                }
              </td>
            </tr>
          );
        }
      }
    }

    return items;
  }

  updateInput(e) {
    if (e.target.name === 'wifkeysPassphrase') {
      // remove any empty chars from the start/end of the string
      const newValue = e.target.value;

      clearTimeout(this.state.trimPassphraseTimer);

      const _trimPassphraseTimer = setTimeout(() => {
        this.setState({
          wifkeysPassphrase: newValue ? newValue.trim() : '', // hardcoded field name
        });
      }, 2000);

      this.resizeLoginTextarea();

      this.setState({
        trimPassphraseTimer: _trimPassphraseTimer,
        [e.target.name]: newValue,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  }

  renderDebugLogData() {
    if (this.props.Settings.debugLog) {
      const _debugLogDataRows = this.props.Settings.debugLog.split('\n');

      if (_debugLogDataRows &&
          _debugLogDataRows.length) {
        return _debugLogDataRows.map((_row) =>
          <div
            key={ `settings-debuglog-${Math.random(0, 9) * 10}` }
            className="padding-bottom-5">{ _row }</div>
        );
      } else {
        return (
          <span>{ translate('INDEX.EMPTY_DEBUG_LOG') }</span>
        );
      }
    } else {
      return null;
    }
  }

  renderLB(_translationID) {
    const _translationComponents = translate(_translationID).split('<br>');

    return _translationComponents.map((_translation) =>
      <span key={ `settings-label-${Math.random(0, 9) * 10}` }>
        { _translation }
        <br />
      </span>
    );
  }

  // TODO: rerender only if prop is changed
  renderCliResponse() {
    const _cliResponse = this.props.Settings.cli;
    let _items = [];

    if (_cliResponse) {
      let _cliResponseParsed;
      let responseType;

      try {
        _cliResponseParsed = JSON.parse(_cliResponse.result);
      } catch(e) {
        _cliResponseParsed = _cliResponse.result;
      }

      if (Object.prototype.toString.call(_cliResponseParsed) === '[object Array]') {
        responseType = 'array';

        for (let i = 0; i < _cliResponseParsed.length; i++) {
          _items.push(
            <div key={ `cli-response-${Math.random(0, 9) * 10}` }>{ JSON.stringify(_cliResponseParsed[i], null, '\t') }</div>
          );
        }
      }
      if (Object.prototype.toString.call(_cliResponseParsed) === '[object]' ||
          typeof _cliResponseParsed === 'object') {
        responseType = 'object';

        _items.push(
          <div key={ `cli-response-${Math.random(0, 9) * 10}` }>{ JSON.stringify(_cliResponseParsed, null, '\t') }</div>
        );
      }
      if (Object.prototype.toString.call(_cliResponseParsed) === 'number' ||
          typeof _cliResponseParsed === 'boolean' ||
          _cliResponseParsed === 'wrong cli string format') {
        responseType = 'number';

        _items.push(
          <div key={ `cli-response-${Math.random(0, 9) * 10}` }>{ _cliResponseParsed.toString() }</div>
        );
      }

      if (responseType !== 'number' &&
          responseType !== 'array' &&
          responseType !== 'object' &&
          _cliResponseParsed.indexOf('\n') > -1) {
        _cliResponseParsed = _cliResponseParsed.split('\n');

        for (let i = 0; i < _cliResponseParsed.length; i++) {
          _items.push(
            <div key={ `cli-response-${Math.random(0, 9) * 10}` }>{  _cliResponseParsed[i] }</div>
          );
        }
      }

      return (
        <div>
          <div>
            <strong>{ translate('SETTINGS.CLI_RESPONSE') }:</strong>
          </div>
          { _items }
        </div>
      );
    } else {
      return null;
    }
  }

  renderActiveCoinsList(mode) {
    const modes = [
      'native',
      'basilisk',
      'full'
    ];

    const allCoins = this.props.Main.coins;
    let items = [];

    if (allCoins) {
      if (mode === 'all') {
        modes.map(function(mode) {
          allCoins[mode].map(function(coin) {
            items.push(
              <option
                value={ coin }
                key={ coin }>
                { coin } ({ mode })
              </option>
            );
          });
        });
      } else {
        allCoins[mode].map(function(coin) {
          items.push(
            <option
              value={ coin }
              key={ coin }>
              { coin } ({ mode })
            </option>
          );
        });
      }

      return items;
    } else {
      return null;
    }
  }

  renderExportWifKeysRaw() {
    const _wifKeysResponse = this.props.Settings.wifkey;

    if (_wifKeysResponse &&
        this.state.exportWifKeysRaw) {
      return (
        <div className="padding-bottom-30 padding-top-30">
          { JSON.stringify(_wifKeysResponse, null, '\t') }
        </div>
      );
    } else {
      return null;
    }
  }

  renderWifKeys() {
    let items = [];

    if (this.props.Settings.wifkey) {
      const _wifKeys = this.props.Settings.wifkey;

      for (let i = 0; i < 2; i++) {
        items.push(
          <tr key={ `wif-export-table-header-${i}` }>
            <td className="padding-bottom-10 padding-top-10">
              <strong>{ i === 0 ? translate('SETTINGS.ADDRESS_LIST') : translate('SETTINGS.WIF_KEY_LIST') }</strong>
            </td>
            <td className="padding-bottom-10 padding-top-10"></td>
          </tr>
        );

        for (let _key in _wifKeys) {
          if ((i === 0 && _key.length === 3 && _key !== 'tag') ||
              (i === 1 && _key.indexOf('wif') > -1)) {
            items.push(
              <tr key={ _key }>
                <td>{ _key }</td>
                <td className="padding-left-15">{ _wifKeys[_key] }</td>
              </tr>
            );
          }
        }
      }

      return items;
    } else {
      return null;
    }
  }

  exportWifKeysRaw() {
    this.setState(Object.assign({}, this.state, {
      exportWifKeysRaw: !this.state.exportWifKeysRaw,
    }));
  }

  render() {
    return SettingsRender.call(this);
  }
}

export default Settings;
