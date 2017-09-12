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
                        style={{ height: this.state.activeTab === 0 ? `auto` : '0' }}>
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
                      style={{ height: this.state.activeTab === 1 ? `auto` : '0' }}>
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
                      style={{ height: this.state.activeTab === 2 ? `auto` : '0' }}>
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
                      style={{ height: this.state.activeTab === 3 ? `auto` : '0' }}>
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
                      style={{ height: this.state.activeTab === 4 ? `auto` : '0' }}>
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
                      style={{ height: this.state.activeTab === 5 ? `auto` : '0' }}>
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
                      style={{ height: this.state.activeTab === 6 ? `auto` : '0' }}>
                      { this.renderDebugLog() }
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
                      style={{ height: this.state.activeTab === 7 ? `auto` : '0' }}>
                      { this.renderAppSettings() }
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
                      style={{ height: this.state.activeTab === 8 ? `auto` : '0' }}>
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
                        style={{ height: this.state.activeTab === 9 ? `auto` : '0' }}>
                        { this.renderCliPanel() }
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
                      style={{ height: this.state.activeTab === 10 ? `auto` : '0' }}>
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
                      style={{ height: this.state.activeTab === 11 ? `auto` : '0' }}>
                      { this.renderSupportPanel() }
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