import React from 'react';
import { translate } from '../../../translate/translate';
import { connect } from 'react-redux';

class AppInfoTab extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="panel-body">
        <div className="col-sm-12 padding-top-15">
          <div className="row">
            <h5>{ translate('SETTINGS.APP_RELEASE') }</h5>
            <div>
              { translate('SETTINGS.NAME') }: { this.props.Settings.appInfo.releaseInfo.name }
            </div>
            <div>
              { translate('SETTINGS.VERSION') }: { `${this.props.Settings.appInfo.releaseInfo.version.replace('version=', '')}-beta` }
            </div>
            <div>
              { translate('SETTINGS.APP_SESSION') }: { this.props.Settings.appInfo.appSession }
            </div>
          </div>
        </div>
        <div className="col-sm-12 padding-top-20">
          <div className="row">
            <h5>{ translate('SETTINGS.SYS_INFO') }</h5>
            <div>
              { translate('SETTINGS.ARCH') }: { this.props.Settings.appInfo.sysInfo.arch }
            </div>
            <div>
              { translate('SETTINGS.OS_TYPE') }: { this.props.Settings.appInfo.sysInfo.os_type }
            </div>
            <div>
              { translate('SETTINGS.OS_PLATFORM') }: { this.props.Settings.appInfo.sysInfo.platform }
            </div>
            <div>
              { translate('SETTINGS.OS_RELEASE') }: { this.props.Settings.appInfo.sysInfo.os_release }
            </div>
            <div>
              { translate('SETTINGS.CPU') }: { this.props.Settings.appInfo.sysInfo.cpu }
            </div>
            <div>
              { translate('SETTINGS.CPU_CORES') }: { this.props.Settings.appInfo.sysInfo.cpu_cores }
            </div>
            <div>
              { translate('SETTINGS.MEM') }: { this.props.Settings.appInfo.sysInfo.totalmem_readable }
            </div>
          </div>
        </div>
        <div className="col-sm-12 padding-top-20">
          <div className="row">
            <h5>{ translate('SETTINGS.LOCATIONS') }</h5>
            <div>
              { translate('SETTINGS.CACHE') }: { this.props.Settings.appInfo.dirs.cacheLocation }
            </div>
            <div>
              { translate('SETTINGS.CONFIG') }: { this.props.Settings.appInfo.dirs.configLocation }
            </div>
            <div>
              Iguana { translate('SETTINGS.BIN') }: { this.props.Settings.appInfo.dirs.iguanaBin }
            </div>
            <div>
              Iguana { translate('SETTINGS.DIR') }: { this.props.Settings.appInfo.dirs.iguanaDir }
            </div>
            <div>
              Komodo { translate('SETTINGS.BIN') }: { this.props.Settings.appInfo.dirs.komododBin }
            </div>
            <div>
              Komodo { translate('SETTINGS.DIR') }: { this.props.Settings.appInfo.dirs.komodoDir }
            </div>
            <div>
              Komodo wallet.dat: { this.props.Settings.appInfo.dirs.komodoDir }
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    Settings: state.Settings,      
  };

};

export default connect(mapStateToProps)(AppInfoTab);