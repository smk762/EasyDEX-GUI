import React from 'react';
import { translate } from '../../../translate/translate';

export const SettingsRender = function() {
  return (
    <div className="margin-left-0 full-height">
      <div
        className="page-content full-height"
        id="section-iguana-wallet-settings">
        <div className="row">
          <div className="col-xlg-12 col-md-12">
            <div className="row">
              <div className="col-xlg-12 col-md-12">
                <h4 className="font-size-14 text-uppercase">{ translate('INDEX.WALLET_SETTINGS') }</h4>
                <div
                  className="panel-group"
                  id="SettingsAccordion">

                  { !this.props.disableWalletSpecificUI &&
                    <div
                      id="WalletInfo"
                      onClick={ () => this.openTab('WalletInfo', 0) }
                      className={ 'panel' + (this.state.nativeOnly ? ' hide' : '') }>
                      <div className="panel-heading">
                        <a className={ 'panel-title' + (this.state.activeTab === 0 ? '' : ' collapsed') }>
                          <i className="icon md-balance-wallet"></i>{ translate('INDEX.WALLET_INFO') }
                        </a>
                      </div>
                      <div
                        className={ 'panel-collapse collapse' + (this.state.activeTab === 0 ? ' in' : '') }
                        style={{ height: this.state.activeTab === 0 ? `${this.state.activeTabHeight}px` : '0' }}>
                        { this.renderWalletInfo() }
                      </div>
                    </div>
                  }
                  { !this.props.disableWalletSpecificUI &&
                  <div
                    id="AddNodeforCoin"
                    onClick={ () => this.openTab('AddNodeforCoin', 1) }
                    className={ 'panel' + (this.state.nativeOnly ? ' hide' : '') }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 1 ? '' : ' collapsed') }>
                        <i className="icon md-plus-square"></i>{ translate('INDEX.ADD_NODE') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 1 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 1 ? `${this.state.activeTabHeight}px` : '0' }}>
                      { this.renderAddNode() }
                    </div>
                  </div>
                  }
                  { !this.props.disableWalletSpecificUI &&
                  <div
                    id="DumpWallet"
                    onClick={ () => this.openTab('DumpWallet', 2) }
                    className={ 'panel' + (this.state.nativeOnly ? ' hide' : '') }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 2 ? '' : ' collapsed') }>
                        <i className="icon wb-briefcase"></i>{ translate('INDEX.WALLET_BACKUP') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 2 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 2 ? `${this.state.activeTabHeight}px` : '0' }}>
                      { this.renderWalletBackup() }
                  </div>
                  </div>
                  }
                  { !this.props.disableWalletSpecificUI &&
                  <div
                    id="FiatCurrencySettings"
                    onClick={ () => this.openTab('FiatCurrencySettings', 3) }
                    className={ 'panel' + (this.state.nativeOnly ? ' hide' : '') }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 3 ? '' : ' collapsed') }>
                        <i className="icon fa-money"></i>{ translate('INDEX.FIAT_CURRENCY') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 3 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 3 ? `${this.state.activeTabHeight}px` : '0' }}>
                      { this.renderFiatCurrency() }  </div>
                  </div>
                  }
                  { !this.props.disableWalletSpecificUI &&
                  <div
                    id="ExportKeys"
                    onClick={ () => this.openTab('ExportKeys', 4) }
                    className={ 'panel' + (this.state.nativeOnly ? ' hide' : '') }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 4 ? '' : ' collapsed') }>
                        <i className="icon md-key"></i>{ translate('INDEX.EXPORT_KEYS') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 4 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 4 ? `${this.state.activeTabHeight}px` : '0' }}>
                      { this.renderExportKeys() }
                    </div>
                  </div>
                  }
                  { !this.props.disableWalletSpecificUI &&
                  <div
                    id="ImportKeys"
                    onClick={ () => this.openTab('ImportKeys', 5) }
                    className={ 'panel' + (this.state.nativeOnly ? ' hide' : '') }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 5 ? '' : ' collapsed') }>
                        <i className="icon md-key"></i>{ translate('INDEX.IMPORT_KEYS') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 5 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 5 ? `${this.state.activeTabHeight}px` : '0' }}>
                      { this.renderImportKeys() }
                    </div>
                  </div>
                  }

                  <div
                    className="panel"
                    id="DebugLog"
                    onClick={ () => this.openTab('DebugLog', 6) }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 6 ? '' : ' collapsed') }>
                        <i className="icon fa-bug"></i>{ translate('INDEX.DEBUG_LOG') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 6 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 6 ? `${this.state.activeTabHeight}px` : '0' }}>
                      <div className="panel-body">
                        <p>{ translate('INDEX.DEBUG_LOG_DESC') }</p>
                        <div className="col-sm-12"></div>
                        <form
                          className="read-debug-log-import-form"
                          method="post"
                          action="javascript:"
                          autoComplete="off">
                          <div className="form-group form-material floating">
                            <input
                              type="text"
                              className="form-control"
                              name="debugLinesCount"
                              id="readDebugLogLines"
                              value={ this.state.debugLinesCount }
                              onChange={ this.updateInput } />
                            <label
                              className="floating-label"
                              htmlFor="readDebugLogLines">{ translate('INDEX.DEBUG_LOG_LINES') }</label>
                          </div>
                          <div className="form-group form-material floating">
                            <select
                              className="form-control form-material"
                              name="debugTarget"
                              id="settingsDelectDebugLogOptions"
                              onChange={ this.updateInput }>
                              <option value="iguana" className={ this.state.nativeOnly ? 'hide' : '' }>Iguana</option>
                              <option value="komodo">Komodo</option>
                            </select>
                            <label
                              className="floating-label"
                              htmlFor="settingsDelectDebugLogOptions">{ translate('INDEX.TARGET') }</label>
                          </div>
                          <div className="col-sm-12 col-xs-12 text-align-center">
                            <button
                              type="button"
                              className="btn btn-primary waves-effect waves-light"
                              onClick={ this.readDebugLog }>{ translate('INDEX.LOAD_DEBUG_LOG') }</button>
                          </div>
                          <div className="col-sm-12 col-xs-12 text-align-left">
                            <div className="padding-top-40 padding-bottom-20 horizontal-padding-0">{ this.renderDebugLogData() }</div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div
                    className="panel"
                    id="AppSettings"
                    onClick={ () => this.openTab('AppSettings', 7) }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 7 ? '' : ' collapsed') }>
                        <i className="icon fa-wrench"></i>{ translate('SETTINGS.APP_CONFIG') } (config.json)
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 7 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 7 ? `${this.state.activeTabHeight}px` : '0' }}>
                      <div className="panel-body">
                        <p>
                          <strong>{ translate('SETTINGS.CONFIG_RESTART_REQUIRED') }</strong>
                        </p>
                        <div className="col-sm-12 padding-top-15">
                          <table>
                            <tbody>
                            { this.renderConfigEditForm() }
                            </tbody>
                          </table>
                        </div>
                        <div className="col-sm-12 col-xs-12 text-align-center padding-top-35 padding-bottom-30">
                          <button
                            type="button"
                            className="btn btn-primary waves-effect waves-light"
                            onClick={ this._saveAppConfig }>{ translate('SETTINGS.SAVE_APP_CONFIG') }</button>
                          <button
                            type="button"
                            className="btn btn-primary waves-effect waves-light margin-left-30"
                            onClick={ this._resetAppConfig }>Reset to default</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="panel"
                    id="AppInfo"
                    onClick={ () => this.openTab('AppInfo', 8) }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 8 ? '' : ' collapsed') }>
                        <i className="icon md-info"></i>{ translate('SETTINGS.APP_INFO') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 8 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 8 ? `${this.state.activeTabHeight}px` : '0' }}>
                      { this.renderAppInfoTab() }
                    </div>
                  </div>

                  { this.props.Main && this.props.Main.coins.native &&
                    <div
                      id="Cli"
                      onClick={ () => this.openTab('Cli', 9) }
                      className={ 'panel' + (!this.props.Main.coins.native.length ? ' hide' : '') }>
                      <div className="panel-heading">
                        <a className={ 'panel-title' + (this.state.activeTab === 9 ? '' : ' collapsed') }>
                          <i className="icon fa-code"></i> CLI
                        </a>
                      </div>
                      <div
                        className={ 'panel-collapse collapse' + (this.state.activeTab === 9 ? ' in' : '') }
                        style={{ height: this.state.activeTab === 9 ? `${this.state.activeTabHeight}px` : '0' }}>
                        <div className="panel-body">
                          <p>{ translate('INDEX.CLI_SELECT_A_COIN') }</p>
                          <div className="col-sm-12"></div>
                          <form
                            className="execute-cli-cmd-form"
                            method="post"
                            action="javascript:"
                            autoComplete="off">
                            <div className="form-group form-material floating">
                              <select
                                className="form-control form-material"
                                name="cliCoin"
                                id="settingsCliOptions"
                                onChange={ this.updateInput }>
                                <option>{ translate('INDEX.CLI_NATIVE_COIN') }</option>
                                { this.renderActiveCoinsList('native') }
                              </select>
                              <label
                                className="floating-label"
                                htmlFor="settingsDelectDebugLogOptions">{ translate('INDEX.COIN') }</label>
                            </div>
                            <div className="form-group form-material floating">
                              <textarea
                                type="text"
                                className="form-control"
                                name="cliCmdString"
                                id="cliCmd"
                                value={ this.state.cliCmdString }
                                onChange={ this.updateInput }></textarea>
                              <label
                                className="floating-label"
                                htmlFor="readDebugLogLines">{ translate('INDEX.TYPE_CLI_CMD') }</label>
                            </div>
                            <div className="col-sm-12 col-xs-12 text-align-center">
                              <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                disabled={ !this.state.cliCoin || !this.state.cliCmdString }
                                onClick={ () => this.execCliCmd() }>{ translate('INDEX.EXECUTE') }</button>
                            </div>
                            <div className="col-sm-12 col-xs-12 text-align-left">
                              <div className="padding-top-40 padding-bottom-20 horizontal-padding-0">
                                { this.renderCliResponse() }
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  }

                  <div
                    className="panel"
                    id="AppUpdate"
                    onClick={ () => this.openTab('AppUpdate', 10) }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 10 ? '' : ' collapsed') }>
                        <i className="icon fa fa-cloud-download"></i> { translate('INDEX.UPDATE') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 10 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 10 ? `${this.state.activeTabHeight}px` : '0' }}>
                        { this.renderAppUpdateTab() }
                    </div>
                  </div>
                  
                  <div
                    className="panel"
                    id="Support"
                    onClick={ () => this.openTab('Support', 11) }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 11 ? '' : ' collapsed') }>
                        <i className="icon fa fa-life-ring"></i> Support
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 11 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 11 ? `${this.state.activeTabHeight}px` : '0' }}>
                      <div className="panel-body">
                        <div className="col-sm-12 no-padding-left">
                          <div className="support-box-wrapper">
                            <div
                              className="support-box"
                              onClick={ () => this.openExternalWindow('http://support.supernet.org') }>
                              <img
                                src="assets/images/cryptologo/supernet.png"
                                alt="Support tickets" />
                              <div className="support-box-title">{ translate('SETTINGS.SUPPORT_TICKETS') }</div>
                              <div className="support-box-link">support.supernet.org</div>
                            </div>
                          </div>
                          <div className="support-box-wrapper">
                            <div
                              className="support-box"
                              onClick={ () => this.openExternalWindow('https://sprnt.slack.com') }>
                              <img
                                src="assets/images/support/slack-icon.png"
                                alt="Slack" />
                              <div className="support-box-title">Slack</div>
                              <div className="support-box-link">sprnt.slack.com</div>
                            </div>
                          </div>
                          <div className="support-box-wrapper">
                            <div
                              className="support-box"
                              onClick={ () => this.openExternalWindow('http://slackinvite.supernet.org') }>
                              <img
                                src="assets/images/support/slack-invite-icon.png"
                                alt="Slack invite" />
                              <div className="support-box-title">{ translate('SETTINGS.GET_SLACK_INVITE') }</div>
                              <div className="support-box-link">slackinvite.supernet.org</div>
                            </div>
                          </div>
                          <div className="support-box-wrapper">
                            <div
                              className="support-box"
                              onClick={ () => this.openExternalWindow('https://github.com/SuperNETorg/Agama') }>
                              <img
                                src="assets/images/support/github-icon.png"
                                alt="Github" />
                              <div className="support-box-title">Github</div>
                              <div className="support-box-link">github.com/SuperNETorg/Agama</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};