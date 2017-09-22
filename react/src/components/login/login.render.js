import React from 'react';
import { translate } from '../../translate/translate';
import LoginSettingsModal from '../dashboard/loginSettingsModal/loginSettingsModal';

const LoginRender = function () {
  return (
    <div>
      <LoginSettingsModal section={ this.state.displayLoginSettingsDropdownSection } />
      <div className="page animsition vertical-align text-center fade-in">
        <div className="page-content vertical-align-middle col-xs-12 col-sm-6 col-sm-offset-3">
          <div className="brand">
            <img
              className="brand-img"
              src="assets/images/agama-login-logo.svg"
              width="200"
              height="160"
              alt="SuperNET Iguana" />
          </div>

          <div className="login-settings-dropdown margin-bottom-30">
            <div>
              <span
                className="login-settings-dropdown-trigger"
                onClick={ this.toggleLoginSettingsDropdown }>
                <i className="icon fa-cogs"></i>&nbsp;
                <span className="login-settings-dropdown-label">{ translate('LOGIN.QUICK_ACCESS') }</span>
              </span>
            </div>
            <div>
              <ul className={ this.state.displayLoginSettingsDropdown ? 'dropdown-menu show' : 'hide' }>
                <li>
                  <a onClick={ () => this.toggleLoginSettingsDropdownSection('settings') }>
                    <i className="icon md-settings"></i> { translate('INDEX.SETTINGS') }
                  </a>
                </li>
                <li>
                  <a onClick={ () => this.toggleLoginSettingsDropdownSection('about') }>
                    <i className="icon fa-users"></i> { translate('ABOUT.ABOUT_AGAMA') }
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={ this.state.activeLoginSection === 'activateCoin' ? 'show' : 'hide' }>
            <h4 className="color-white">
              { translate('INDEX.WELCOME_PLEASE_ADD') }
            </h4>
            <div className="form-group form-material floating width-540 vertical-margin-30 auto-side-margin">
              <button
                className="btn btn-lg btn-primary btn-block ladda-button"
                onClick={ this.toggleActivateCoinForm }
                disabled={ !this.props.Main }>
                <span className="ladda-label">
                  { translate('INDEX.ACTIVATE_COIN') }
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRender;