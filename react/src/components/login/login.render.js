import React from 'react';
import { translate } from '../../translate/translate';

const LoginRender = function () {
  return (
    <div>
      { this.renderSwallModal() }
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

          <div className="vertical-padding-20 horizontal-padding-0">
            <span
              className="display-sync-only-coins-toggle"
              onClick={ this.openSyncOnlyModal }>
              <i className="fa fa-cubes"></i> { translate('LOGIN.DISPLAY_SYNC_ONLY') }
            </span>
          </div>

          <div className={ this.state.activeLoginSection === 'ieWarning' ? 'show' : 'hide' }>
            <div className="panel">
              <div className="panel-heading">
                <h3 className="panel-title">
                  { translate('INDEX.UNSUPPORTED_BROWSER') }
                </h3>
              </div>
              <div className="alert alert-danger alert-dismissible">
                <button type="button">
                  <span>&times;</span>
                  <span className="sr-only">
                    { translate('INDEX.CLOSE') }
                  </span>
                </button>
                { translate('INDEX.IE_UNSUPPORTED') }
              </div>
              <div className="panel-body">
                <p className="browser-usage-container">
                  { translate('INDEX.PLEASE_USE') } <a href="https://www.google.com/chrome/">Google Chrome</a> { translate('INDEX.OR') } <a href="https://www.firefox.com">Mozilla FireFox</a> { translate('INDEX.TO_USE') } EasyDEX-GUI. { translate('INDEX.PLEASE_CLICK_ON') }.
                </p>
                <div className="col-sm-6 col-xs-6">
                  <a href="https://www.google.com/chrome/"><img className="brand-img" src="assets/images/browsers/chrome.png" alt="Google Chrome" /></a>
                </div>
                <div className="col-sm-6 col-xs-6">
                  <a href="https://www.firefox.com"><img className="brand-img" src="assets/images/browsers/firefox.png" alt="Mozilla FireFox" /></a>
                </div>
              </div>
            </div>
          </div>

          <div className={ this.state.activeLoginSection === 'login' ? 'show' : 'hide' }>
            <h4 className="color-white">
              {translate('INDEX.WELCOME_LOGIN')}
            </h4>
            <div className="form-group form-material floating col-sm-9 horizontal-padding-0">
              <input
                type={ this.state.seedInputVisibility ? 'text' : 'password' }
                className="form-control"
                name="loginPassphrase"
                onChange={ this.updateLoginPassPhraseInput }
                onKeyDown={ (event) => this.handleKeydown(event) }/>
              <i
                className={ !this.state.seedInputVisibility ? 'seed-toggle fa fa-eye-slash' : 'seed-toggle fa fa-eye' }
                onClick={ this.toggleSeedInputVisibility }></i>
              <label
                className="floating-label"
                htmlFor="inputPassword">{ translate('INDEX.WALLET_SEED') }</label>
            </div>
            <div className="form-group form-material floating col-sm-3 horizontal-padding-0 margin-top-20">
              { this.state.loginPassPhraseSeedType
                ?
                  this.state.loginPassPhraseSeedType
                :
                <div className="placeholder-label">Seed Type</div>
              }
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={ this.loginSeed }
              disabled={ !this.state.loginPassphrase
              || !this.state.loginPassphrase.length }>{ translate('INDEX.SIGN_IN') }</button>
            <div className="form-group form-material floating">
              <button
                className="btn btn-lg btn-flat btn-block waves-effect"
                id="register-btn"
                onClick={ () => this.updateActiveLoginSection('signup') }>{ translate('INDEX.CREATE_WALLET') }</button>
              <button
                className="btn btn-lg btn-flat btn-block waves-effect hide"
                id="logint-another-wallet">{ translate('INDEX.LOGIN_ANOTHER_WALLET') }</button>
              <button
                className="btn btn-lg btn-flat btn-block waves-effect margin-top-20"
                id="register-btn"
                onClick={ this.toggleActivateCoinForm }
                disabled={ !this.props.Main }>
                <span className="ladda-label">
                  { translate('ADD_COIN.ADD_ANOTHER_COIN') }
                </span>
              </button>
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

          <div className={ this.state.activeLoginSection === 'signup' ? 'show' : 'hide' }>
            <div className="register-form">
              <h4 className="hint color-white">
                { translate('INDEX.SELECT_SEED_TYPE') }:
              </h4>
              <div className="row">
                <div className="col-sm-5 horizontal-padding-0">
                  <div className="toggle-box vertical-padding-20">
                    <span className="pointer">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={ this.isCustomWalletSeed() } />
                        <div
                          className="slider"
                          onClick={ () => this.toggleCustomWalletSeed() }></div>
                      </label>
                      <div
                        className="toggle-label white"
                        onClick={ () => this.toggleCustomWalletSeed() }>
                          { translate('LOGIN.CUSTOM_WALLET_SEED') }
                      </div>
                    </span>
                  </div>
                </div>
                <div className="col-sm-7 horizontal-padding-0">
                { !this.isCustomWalletSeed() &&
                  <div>
                    <div className="form-group form-material floating">
                      <div
                        className="radio-custom radio-default radio-inline"
                        onClick={ () => this.generateNewSeed(256) }>
                        <input
                          type="radio"
                          name="PassPhraseOptions"
                          checked={ this.state.bitsOption === 256 }/>
                        <label htmlFor="PassPhraseOptionsIguana">
                          { translate('LOGIN.IGUANA_SEED') }
                        </label>
                      </div>
                      <div
                        className="radio-custom radio-default radio-inline"
                        onClick={ () => this.generateNewSeed(160) }>
                        <input
                          type="radio"
                          name="PassPhraseOptions"
                          checked={ this.state.bitsOption === 160 }/>
                        <label htmlFor="PassPhraseOptionsWaves">
                          { translate('LOGIN.WAVES_SEED') }
                        </label>
                      </div>
                      <div
                        className="radio-custom radio-default radio-inline"
                        onClick={ () => this.generateNewSeed(128) }>
                        <input
                          type="radio"
                          name="PassPhraseOptions"
                          checked={ this.state.bitsOption === 128 }/>
                        <label htmlFor="PassPhraseOptionsNXT">
                          { translate('LOGIN.NXT_SEED') }
                        </label>
                      </div>
                    </div>
                  </div>
                }
                </div>
              </div>

              <div className="form-group form-material floating seed-tooltip">
                <textarea
                  className="form-control placeholder-no-fix height-100"
                  type="text"
                  id="walletseed"
                  value={ this.state.randomSeed }
                  onChange={ (e) => this.updateWalletSeed(e) }
                  readOnly={ !this.isCustomWalletSeed() }
                ></textarea>
                <span className={ this.state.isCustomSeedWeak ? 'tooltiptext' : 'hide' }>
                  <strong>Weak seed!</strong><br /><br />
                  Your seed must contain:<br />
                  - at least 1 upper case letter<br />
                  - at least 1 digit<br />
                  - at least 1 special character<br />
                  - minimum 10 characters long
                </span>
                <label
                  className="floating-label"
                  htmlFor="walletseed">{ translate('INDEX.WALLET_SEED') }</label>
              </div>
              <div className="form-group form-material floating">
                <textarea
                  className="form-control placeholder-no-fix height-100"
                  type="text"
                  name="randomSeedConfirm"
                  value={ this.state.randomSeedConfirm }
                  onChange={ this.updateRegisterConfirmPassPhraseInput }
                  id="rwalletseed"></textarea>
                <span className={ this.state.isSeedBlank ? 'help-block' : 'hide' }>
                  { translate('LOGIN.MUST_ENTER_SEED') }.
                </span>
                <span className={ this.state.isSeedConfirmError ? 'help-block' : 'hide' }>
                  { translate('LOGIN.ENTER_VALUE_AGAIN') }.
                </span>
                <label
                  className="floating-label"
                  htmlFor="rwalletseed">{ translate('INDEX.CONFIRM_SEED') }</label>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={ this.handleRegisterWallet }>{ translate('INDEX.REGISTER') }</button>
              <div className="form-group form-material floating">
                <button
                  className="btn btn-lg btn-flat btn-block waves-effect"
                  id="register-back-btn"
                  onClick={ () => this.updateActiveLoginSection('login') }>{ translate('INDEX.BACK_TO_LOGIN') }</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRender;