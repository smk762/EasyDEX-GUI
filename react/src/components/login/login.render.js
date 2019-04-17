import React from 'react';
import translate from '../../translate/translate';
import LoginSettingsModal from '../dashboard/loginSettingsModal/loginSettingsModal';
import ZcparamsFetchModal from '../dashboard/zcparamsFetchModal/zcparamsFetchModal';
import QRModal from '../dashboard/qrModal/qrModal';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import mainWindow, { staticVar } from '../../util/mainWindow';
import nnConfig from '../nnConfig';
import Config from '../../config';
import {
  isPrivKey,
  stringToWif,
  wifToWif,
} from 'agama-wallet-lib/build/keys';
import networks from 'agama-wallet-lib/src/bitcoinjs-networks';

const LoginRender = function() {
  let shortcuts = [
    {
      value: 'kmd',
      label: 'kmd',
    },
    {
      value: 'pirate',
      label: 'pirate',
    },
    {
      value: 'btch',
      label: 'btch',
    },
    {
      value: 'revs',
      label: 'revs',
    },
    {
      value: 'jumblr',
      label: 'jumblr',
    },
    {
      value: 'kmd+revs+jumblr',
      label: 'kmd+revs+jumblr',
    },
  ];

  if (Math.floor(Date.now() / 1000) > nnConfig.activation && 
      Math.floor(Date.now() / 1000) < nnConfig.deactivation) {
    shortcuts.shift();
    shortcuts.unshift({
      value: 'kmd',
      label: 'kmd',
    }, {
      value: 'vote2019',
      label: 'vote2019',
    });
  }

  const renderCreateSeedWordsConfirm = () => {
    const words = this.state.randomSeedShuffled;
    let items = [];

    for (let i = 0; i < words.length; i++) {
      if (this.state.randomSeedConfirm.indexOf(words[i]) === -1) {
        items.push(
          <span
            key={ `seed-confirm-word-${i}` }
            className="seed-confirm-word"
            onClick={ () => this.createSeedConfirmPush(words[i]) }>
            { words[i] }
          </span>
        );
      }
    }

    return items;
  }

  return (
    <div>
      <ZcparamsFetchModal />
      <LoginSettingsModal section={ this.state.displayLoginSettingsDropdownSection } />
      <div className="page animsition vertical-align text-center fade-in">
        <div className="page-content vertical-align-middle col-xs-12 col-sm-6 col-sm-offset-3">
          <div className="brand">
            <img
              className="brand-img"
              src="assets/images/agama-login-logo.svg"
              width="200"
              height="160"
              alt="SuperNET Agama" />
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
            { this.state.displayLoginSettingsDropdown &&
              <div>
                <ul className="dropdown-menu show">
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
                  <li>
                    <a onClick={ () => this.toggleLoginSettingsDropdownSection('tools') }>
                      <i className="icon fa-wrench"></i> { translate('TOOLS.TOOLS') }
                    </a>
                  </li>
                  <li>
                    <a onClick={ () => this.toggleLoginSettingsDropdownSection('elections') }>
                      <i className="icon fa-thumbs-up"></i> { `${translate('NN_ELECTIONS.NN_ELECTIONS')} ${new Date().getFullYear()}` }
                    </a>
                  </li>
                  <li>
                    <a onClick={ () => this.toggleLoginSettingsDropdownSection('changelog') }>
                      <i className="icon fa-list"></i> { translate('INDEX.CHANGE_LOG') }
                    </a>
                  </li>
                  { this.renderResetSPVCoinsOption() &&
                    <li>
                      <a onClick={ this.resetSPVCoins }>
                        <i className="icon fa-trash"></i> { translate('LOGIN.QMENU_REMOVE_SPV') }
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>

          <div className={ this.state.activeLoginSection === 'login' ? 'show' : 'hide' }>
            { (this.props.Login.pinList.length > 0 || staticVar.argv.indexOf('hardcore') > -1) &&
              <h4 className="color-white">
                { translate('INDEX.WELCOME_LOGIN') }
              </h4>
            }
            { this.props.Login.pinList.length === 0 &&
              <h4 className="color-white padding-bottom-20">
                { translate('INDEX.WELCOME_LOGIN_NEW') }
              </h4>
            }
            { this.props.Login.pinList.length > 0 &&
              <div className="pin-login-block padding-top-30">
                <div className="form-group form-material col-sm-8 horizontal-padding-0 margin-top-40 margin-bottom-60">
                  <select
                    className="form-control form-material"
                    name="selectedPin"
                    id="selectedPin"
                    ref="selectedPin"
                    value={ this.state.selectedPin }
                    onChange={ (event) => this.updateSelectedPin(event) }
                    autoFocus>
                    <option
                      className="login-option"
                      value="">
                      { translate('INDEX.SELECT_PIN_NAME') }
                    </option>
                    { this.renderPinsList() }
                  </select>
                  <label
                    className="floating-label margin-bottom-20"
                    htmlFor="selectedPin">
                    { translate('LOGIN.PIN_PW_ACCESS') }
                  </label>
                </div>
                <div className="form-group form-material col-sm-4 padding-left-10 margin-top-40 margin-bottom-60">
                  <input
                    type="password"
                    className="form-control"
                    name="decryptKey"
                    ref="decryptKey"
                    placeholder={ translate('LOGIN.DECRYPT_KEY') }
                    onChange={ this.updateInput }
                    onKeyDown={ (event) => this.handleKeydown(event) }
                    value={ this.state.decryptKey } />
                </div>
              </div>
            }
            { staticVar.argv.indexOf('hardcore') > -1 &&
              <div>
                <div className="form-group form-material floating col-sm-12 horizontal-padding-0">
                  <input
                    type="password"
                    name="loginPassphrase"
                    ref="loginPassphrase"
                    className={ !this.state.seedInputVisibility ? 'form-control' : 'hide' }
                    onChange={ this.updateLoginPassPhraseInput }
                    onKeyDown={ (event) => this.handleKeydown(event) }
                    autoComplete="off"
                    value={ this.state.loginPassphrase || '' } />
                  <div className={ this.state.seedInputVisibility ? 'form-control seed-reveal selectable blur' : 'hide' }>
                    { this.state.loginPassphrase || '' }
                  </div>
                  <i
                    className={ 'seed-toggle fa fa-eye' + (!this.state.seedInputVisibility ? '-slash' : '') }
                    onClick={ this.toggleSeedInputVisibility }></i>
                  <label
                    className="floating-label"
                    htmlFor="inputPassword">
                    { translate('INDEX.WALLET_SEED') }
                  </label>
                  <div className="qr-modal-login-block">
                    <QRModal
                      mode="scan"
                      setRecieverFromScan={ this.setRecieverFromScan } />
                  </div>
                </div>
                { this.state.loginPassPhraseSeedType &&
                  <div
                    className={ 'form-group form-material floating horizontal-padding-0 seed-type-block ' + (this.props.Login.pinList.length > 0 ? 'margin-top-130' : 'margin-top-20') }
                    style={{ width: `${this.state.loginPassPhraseSeedType.length * 8}px` }}>
                    <div className="placeholder-label">{ this.state.loginPassPhraseSeedType }</div>
                  </div>
                }
                { this.state.seedExtraSpaces &&
                  <i className="icon fa-warning seed-extra-spaces-warning"
                    data-tip={ translate('LOGIN.SEED_TRAILING_CHARS') }
                    data-html={ true }
                    data-for="login1"></i>
                }
                <ReactTooltip
                  id="login1"
                  effect="solid"
                  className="text-left" />
              </div>
            }
            { (this.props.Login.pinList.length > 0 || staticVar.argv.indexOf('hardcore') > -1) &&
              <button
                type="button"
                className="btn btn-primary btn-block margin-top-20"
                onClick={ this.loginSeed }
                disabled={
                  (this.props.Login.pinList.length === 0 && (!this.state.loginPassphrase || !this.state.loginPassphrase.length)) ||
                  (this.props.Login.pinList.length > 0 && (!this.state.selectedPin || !this.state.decryptKey) && !this.state.loginPassphrase)
                }>
                { translate('INDEX.SIGN_IN') }
              </button>
            }
            <div className="form-group form-material floating">
              <button
                className="btn btn-lg btn-flat btn-block waves-effect"
                id="register-btn"
                onClick={ () => this.updateActiveLoginSection('signup') }>
                { translate('INDEX.CREATE_WALLET') }
              </button>
              <button
                className="btn btn-lg btn-flat btn-block waves-effect margin-top-20"
                id="register-btn"
                onClick={ () => this.updateActiveLoginSection('restore') }>
                Restore wallet
              </button>
              <button
                className="btn btn-lg btn-flat btn-block waves-effect hide"
                id="logint-another-wallet">
                { translate('INDEX.LOGIN_ANOTHER_WALLET') }
              </button>
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

          { this.state.activeLoginSection === 'activateCoin' &&
            <div className="show">
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
                <div className="line">{ translate('LOGIN.OR_USE_A_SHORTCUT') }</div>
                { staticVar.arch === 'x64' &&
                  <div className="addcoin-shortcut">
                    <div>
                      <i className="icon fa-cube margin-right-5"></i>
                      { translate('INDEX.NATIVE_MODE') }
                      <i
                        className="icon fa-question-circle login-help"
                        data-tip={
                          `<strong>${ translate('LOGIN.NATIVE_MODE_DESC_P1') }</strong> ` +
                          `<u>${ translate('LOGIN.NATIVE_MODE_DESC_P2') }</u> ` +
                          translate('LOGIN.NATIVE_MODE_DESC_P3') +
                          '<br/>' +
                          translate('LOGIN.NATIVE_MODE_DESC_P4') +
                          ` <strong>${ translate('LOGIN.NATIVE_MODE_DESC_P5') }</strong> ` +
                          translate('LOGIN.NATIVE_MODE_DESC_P6') +
                          '<br/>' +
                          translate('LOGIN.NATIVE_MODE_DESC_P7') +
                          ` <u>${ translate('LOGIN.NATIVE_MODE_DESC_P8') }</u> ` +
                          translate('LOGIN.NATIVE_MODE_DESC_P9')
                        }
                        data-html={ true }
                        data-for="login2"></i>
                      <ReactTooltip
                        id="login2"
                        effect="solid"
                        className="text-left" />
                    </div>
                    <Select
                      name="selectedShortcutNative"
                      value={ this.state.selectedShortcutNative }
                      onChange={ (event) => this.updateSelectedShortcut(event, 'native') }
                      optionRenderer={ this.renderShortcutOption }
                      valueRenderer={ this.renderShortcutOption }
                      options={ shortcuts } />
                  </div>
                }
                <div className="addcoin-shortcut">
                  <div>
                    <i className="icon fa-flash margin-right-5"></i>
                    { translate('INDEX.SPV_MODE') }
                    <i
                      className="icon fa-question-circle login-help"
                      data-tip={ 
                        translate('LOGIN.SPV_MODE_DESC_P1') +
                        ` <u>${ translate('LOGIN.SPV_MODE_DESC_P2') }</u> ` +
                        translate('LOGIN.SPV_MODE_DESC_P3') +
                        '<br/>' +
                        translate('LOGIN.SPV_MODE_DESC_P4')
                      }
                      data-html={ true }
                      data-for="login3"></i>
                    <ReactTooltip
                      id="login3"
                      effect="solid"
                      className="text-left" />
                  </div>
                  <Select
                    name="selectedShortcutSPV"
                    value={ this.state.selectedShortcutSPV }
                    onChange={ (event) => this.updateSelectedShortcut(event, 'spv') }
                    optionRenderer={ this.renderShortcutOption }
                    valueRenderer={ this.renderShortcutOption }
                    options={ shortcuts.filter(item => item.value !== 'pirate') } />
                </div>
              </div>
            </div>
          }

          <div className={ this.state.activeLoginSection === 'signup' ? 'show' : 'hide' }>
            <div className="register-form">
              { this.state.step === 0 &&
                <section>
                  <h4 className="hint color-white margin-bottom-20">
                    { translate('LOGIN.THIS_IS_YOUR_NEW_SEED') }
                  </h4>
                  <div className={ 'form-group form-material create-wallet-seed' + (Config.dev ? ' selectable' : '') }>
                    { this.state.randomSeed }
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={ this.nextStep }>
                    { translate('LOGIN.NEXT') }
                  </button>
                </section>
              }
              { this.state.step === 1 &&
                <section>
                  <h4 className="hint color-white margin-bottom-20">
                    { translate('LOGIN.CONFIRM_YOUR_SEED_BY_PLACING_WORDS') }
                  </h4>
                  <div className={ 'form-group form-material create-wallet-seed-confirm-block ' + (this.state.randomSeed !== this.state.randomSeedConfirm.join(' ') ? 'padding-top-30' : 'padding-top-5') }>
                    { this.state.randomSeedConfirm.length < this.state.randomSeedShuffled.length &&
                      <div className="seed-words-block margin-bottom-50">
                        { renderCreateSeedWordsConfirm() }
                      </div>
                    }
                    { this.state.randomSeed !== this.state.randomSeedConfirm.join(' ') &&
                      this.state.randomSeedConfirm &&
                      this.state.randomSeedConfirm.length > 0 &&
                      <i
                        onClick={ this.clearCreateSeedConfirm }
                        className={ 'fa fa-trash seed-confirm-clear' + (this.state.randomSeedConfirm.length === this.state.randomSeedShuffled.length ? ' all-words-used' : '') }></i>
                    }
                    { this.state.randomSeedConfirm &&
                      this.state.randomSeedConfirm.length > 0 &&
                      <div className="create-wallet-seed">
                        <div className="seed-gen-box">{ this.state.randomSeedConfirm.join(' ') }</div>
                      </div>
                    }
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={ this.nextStep }
                    disabled={ this.state.randomSeed !== this.state.randomSeedConfirm.join(' ') }>
                    { translate('LOGIN.NEXT') }
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg btn-flat btn-block waves-effect btn-back"
                    onClick={ this.prevStep }>
                    { translate('LOGIN.START_OVER') }
                  </button>
                </section>
              }
              { this.state.step === 2 &&
                <section>
                  <h4 className="hint color-white margin-bottom-20">
                    { translate('LOGIN.ENTER_WALLET_NAME_AND_PW') }
                  </h4>
                  <div className="seed-encrypt-block padding-top-35">
                    <div className="form-group form-material floating text-left margin-top-20 margin-bottom-60">
                      <input
                        type="text"
                        name="customPinFilename"
                        ref="customPinFilename"
                        className="form-control"
                        onChange={ this.updateInput }
                        autoComplete="off"
                        value={ this.state.customPinFilename || '' } />
                      <label
                        className="floating-label"
                        htmlFor="customPinFilename">
                        { translate('LOGIN.WALLET_NAME') }
                      </label>
                    </div>
                    <div className="form-group form-material floating text-left">
                      <input
                        type="password"
                        name="encryptKey"
                        ref="encryptKey"
                        className="form-control"
                        onChange={ this.updateInput }
                        autoComplete="off"
                        value={ this.state.encryptKey || '' } />
                      <label
                        className="floating-label"
                        htmlFor="encryptKey">
                        { translate('LOGIN.SEED_ENCRYPT_KEY') }
                      </label>
                    </div>
                    <div className="form-group form-material floating text-left margin-top-60 margin-bottom-60">
                      <input
                        type="password"
                        name="encryptKeyConfirm"
                        ref="encryptKeyConfirm"
                        className="form-control"
                        onChange={ this.updateInput }
                        autoComplete="off"
                        value={ this.state.encryptKeyConfirm || '' } />
                      <label
                        className="floating-label"
                        htmlFor="encryptKeyConfirm">
                        { translate('LOGIN.SEED_ENCRYPT_KEY_CONFIRM') }
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={ this.handleRegisterWallet }
                    disabled={
                      !this.state.encryptKey ||
                      !this.state.encryptKeyConfirm ||
                      !this.state.customPinFilename
                    }>
                    { translate('LOGIN.NEXT') }
                  </button>
                </section>
              }
              <div className="form-group form-material floating">
                <button
                  className="btn btn-lg btn-flat btn-block waves-effect"
                  id="register-back-btn"
                  onClick={ () => this.updateActiveLoginSection('login') }>
                  { translate('INDEX.BACK_TO_LOGIN') }
                </button>
              </div>
            </div>
          </div>

          <div className={ this.state.activeLoginSection === 'restore' ? 'show' : 'hide' }>
            { this.state.step === 0 &&
              <section className="restore-wallet">
                <h4 className="hint color-white margin-bottom-60">
                  { translate('LOGIN.PROVIDE_YOUR_PRIV_OR_SEED') }
                </h4>
                <div className="form-group form-material floating col-sm-12 horizontal-padding-0 margin-top-20">
                  <input
                    type="password"
                    name="loginPassphrase"
                    ref="loginPassphrase"
                    className={ !this.state.seedInputVisibility ? 'form-control' : 'hide' }
                    onChange={ this.updateLoginPassPhraseInput }
                    onKeyDown={ (event) => this.handleKeydown(event) }
                    autoComplete="off"
                    value={ this.state.loginPassphrase || '' } />
                  <div className={ this.state.seedInputVisibility ? 'form-control seed-reveal selectable blur' : 'hide' }>
                    { this.state.loginPassphrase || '' }
                  </div>
                  <i
                    className={ 'seed-toggle fa fa-eye' + (!this.state.seedInputVisibility ? '-slash' : '') }
                    onClick={ this.toggleSeedInputVisibility }></i>
                  <label
                    className="floating-label"
                    htmlFor="inputPassword">
                    { translate('INDEX.WALLET_SEED') }
                  </label>
                  <div className="qr-modal-login-block margin-top-30">
                    <QRModal
                      mode="scan"
                      setRecieverFromScan={ this.setRecieverFromScan } />
                  </div>
                </div>
                { this.state.seedExtraSpaces &&
                  <i className="icon fa-warning seed-extra-spaces-warning"
                    data-tip={ translate('LOGIN.SEED_TRAILING_CHARS') }
                    data-html={ true }
                    data-for="login1"></i>
                }
                <ReactTooltip
                  id="login1"
                  effect="solid"
                  className="text-left" />
                <div className="form-group form-material col-sm-12 horizontal-padding-0 padding-top-10">
                  <button
                    type="button"
                    className="btn btn-primary btn-block margin-top-30"
                    onClick={ this.nextStep }
                    disabled={ !this.state.loginPassphrase }>
                    { translate('LOGIN.NEXT') }
                  </button>
                  <div className="form-group form-material floating">
                    <button
                      className="btn btn-lg btn-flat btn-block waves-effect"
                      id="register-back-btn"
                      onClick={ () => this.updateActiveLoginSection('login') }>
                      { translate('INDEX.BACK_TO_LOGIN') }
                    </button>
                  </div>
                </div>
              </section>
            }
            { this.state.step === 1 &&
              <section className="restore-wallet">
                <h4 className="hint color-white margin-bottom-20">
                  { translate('LOGIN.RESTORE_VERIFY_INFO') }
                </h4>
                <div className="form-group form-material create-wallet-seed margin-top-40">
                  <p className="text-center padding-bottom-10">{ translate('LOGIN.' + (isPrivKey(this.state.loginPassphrase) ? 'YOU_PROVIDED_PRIV_KEY' : 'YOU_PROVIDED_SEED')) }</p>
                  <p>{ translate('LOGIN.YOUR_PUB_IS', 'KMD') } { isPrivKey(this.state.loginPassphrase) ? wifToWif(this.state.loginPassphrase || '', networks.kmd, true).pub : stringToWif(this.state.loginPassphrase || '', networks.kmd, true).pub }</p>
                  <p>{ translate('LOGIN.YOUR_PUB_IS', 'BTC') } { isPrivKey(this.state.loginPassphrase) ? wifToWif(this.state.loginPassphrase || '', networks.btc, true).pub : stringToWif(this.state.loginPassphrase || '', networks.btc, true).pub }</p>
                </div>
                <div className="form-group form-material col-sm-12 horizontal-padding-0 padding-top-10">
                  <button
                    type="button"
                    className="btn btn-primary btn-block margin-top-30"
                    onClick={ this.nextStep }>
                    { translate('LOGIN.CONFIRM') }
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg btn-flat btn-block waves-effect btn-back"
                    onClick={ this.prevStep }>
                    { translate('LOGIN.START_OVER') }
                  </button>
                  <div className="form-group form-material floating">
                    <button
                      className="btn btn-lg btn-flat btn-block waves-effect"
                      id="register-back-btn"
                      onClick={ () => this.updateActiveLoginSection('login') }>
                      { translate('INDEX.BACK_TO_LOGIN') }
                    </button>
                  </div>
                </div>
              </section>
            }
            { this.state.step === 2 &&
              <section>
                <h4 className="hint color-white margin-bottom-20">
                  { translate('LOGIN.ENTER_WALLET_NAME_AND_PW') }
                </h4>
                <div className="seed-encrypt-block padding-top-35">
                  <div className="form-group form-material floating text-left margin-top-20 margin-bottom-60">
                    <input
                      type="text"
                      name="customPinFilename"
                      ref="customPinFilename"
                      className="form-control"
                      onChange={ this.updateInput }
                      autoComplete="off"
                      value={ this.state.customPinFilename || '' } />
                    <label
                      className="floating-label"
                      htmlFor="customPinFilename">
                      { translate('LOGIN.WALLET_NAME') }
                    </label>
                  </div>
                  <div className="form-group form-material floating text-left">
                    <input
                      type="password"
                      name="encryptKey"
                      ref="encryptKey"
                      className="form-control"
                      onChange={ this.updateInput }
                      autoComplete="off"
                      value={ this.state.encryptKey || '' } />
                    <label
                      className="floating-label"
                      htmlFor="encryptKey">
                      { translate('LOGIN.SEED_ENCRYPT_KEY') }
                    </label>
                  </div>
                  <div className="form-group form-material floating text-left margin-top-60 margin-bottom-60">
                    <input
                      type="password"
                      name="encryptKeyConfirm"
                      ref="encryptKeyConfirm"
                      className="form-control"
                      onChange={ this.updateInput }
                      autoComplete="off"
                      value={ this.state.encryptKeyConfirm || '' } />
                    <label
                      className="floating-label"
                      htmlFor="encryptKeyConfirm">
                      { translate('LOGIN.SEED_ENCRYPT_KEY_CONFIRM') }
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={ this.handleRegisterWallet }
                  disabled={
                    !this.state.encryptKey ||
                    !this.state.encryptKeyConfirm ||
                    !this.state.customPinFilename
                  }>
                  { translate('LOGIN.NEXT') }
                </button>
              </section>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRender;