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
  multisig,
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

  const renderCreateSeedWordsConfirmStack = () => {
    const words = this.state.randomSeedConfirm;
    let items = [];

    for (let i = 0; i < words.length; i++) {
      items.push(
        <span
          key={ `seed-confirm-word-${i}-stack` }
          className="seed-confirm-word-stack"
          onClick={ this.popCreateSeedConfirm }>
          { words[i] }
        </span>
      );
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
                  { this.renderLogoutOption() &&
                    <li>
                      <a onClick={ this.logout }>
                        <i className="icon fa-trash"></i> { translate('LOGIN.QMENU_LOGOUT') }
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
            { (this.props.Login.pinList.length === 0 && staticVar.argv.indexOf('hardcore') === -1) &&
              <h4 className="color-white padding-bottom-20">
                { translate('INDEX.WELCOME_LOGIN_NEW') }
              </h4>
            }
            { this.props.Login.pinList.length > 0 &&
              <div className="pin-login-block">
                <div className={ 'form-group form-material col-sm-12 horizontal-padding-0 margin-top-30 ' + (this.props.Login.pinList.length === 1 ? 'margin-bottom-10' : 'margin-bottom-30') }>
                  { translate('LOGIN.' + (this.props.Login.pinList.length === 1 ? 'ENTER_A_PW_TO_UNLOCK_WALLET' : 'SELECT_A_WALLET')) }
                  { this.props.Login.pinList.length > 1 && this.renderPinList() }
                </div>
                <div className="form-group form-material col-sm-12 margin-bottom-50 horizontal-padding-0">
                  <input
                    type="password"
                    className="form-control"
                    name="decryptKey"
                    ref="decryptKey"
                    placeholder={ translate('LOGIN.DECRYPT_KEY') }
                    onChange={ this.updateInput }
                    onKeyDown={ (event) => this.handleKeydown(event) }
                    value={ this.state.decryptKey }
                    disabled={ !this.state.selectedPin } />
                </div>
              </div>
            }
            { staticVar.argv.indexOf('hardcore') > -1 &&
              !this.props.Main.isLoggedIn &&
              !this.props.Main.isPin &&
              <div>
                <div className="form-group form-material floating col-sm-12 horizontal-padding-0 margin-top-80 margin-bottom-60">
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
                { translate('LOGIN.RESTORE_WALLET') }
              </button>
              <button
                className="btn btn-lg btn-flat btn-block waves-effect hide"
                id="logint-another-wallet">
                { translate('INDEX.LOGIN_ANOTHER_WALLET') }
              </button>
              { this.props.Main.coins &&
                (staticVar.argv.indexOf('hardcore') > -1 || (!this.props.Main.coins.spv.length && !this.props.Main.coins.eth.length)) &&
                <button
                  className="btn btn-lg btn-flat btn-block waves-effect margin-top-20"
                  id="register-btn"
                  onClick={ this.toggleActivateCoinForm }
                  disabled={ !this.props.Main }>
                  <span className="ladda-label">
                    { translate('ADD_COIN.' + (staticVar.argv.indexOf('hardcore') > -1 ? 'ADD_ANOTHER_COIN' : 'ADD_NATIVE_COIN')) }
                  </span>
                </button>
              }
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
                  (staticVar.argv.indexOf('hardcore') > -1 || this.props.Main.walletType === 'native') &&
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
                { (staticVar.argv.indexOf('hardcore') > -1 || this.props.Main.walletType === 'default') &&
                  <div className={ 'addcoin-shortcut' + (staticVar.arch === 'x64' ? '' : ' full--width') }>
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
                }
              </div>
            </div>
          }

          <div className={ this.state.activeLoginSection === 'signup' ? 'show' : 'hide' }>
            <div className="register-form">
              { this.state.step === 0 &&
                <section>
                  <h4 className="hint color-white padding-top-10 margin-bottom-20 text-center">
                    { translate('LOGIN.CHOOSE_WALLET_TYPE') }
                  </h4>
                  <select
                    className="form-control form-material margin-bottom-20"
                    name="walletType"
                    value={ this.state.walletType }
                    onChange={ (event) => this.updateInput(event) }
                    autoFocus>
                    <option value="default">
                      { translate('LOGIN.LITE_MODE_ONLY') }
                    </option>
                    <option value="native">
                      { translate('LOGIN.NATIVE_MODE_ONLY') }
                    </option>
                    <option value="multisig">
                      { translate('LOGIN.MULTISIG') }
                    </option>
                  </select>
                  { this.state.walletType === 'default' &&
                    <div>
                      <h4 className="hint color-white padding-top-10 margin-bottom-20 text-left">
                        { translate('LOGIN.LITE_MODE_ONLY_DESC_P1') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-20 text-left">
                        { translate('LOGIN.LITE_MODE_ONLY_DESC_P2') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-20 text-left">
                        { translate('LOGIN.LITE_MODE_ONLY_DESC_P3') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-40 text-left">
                        { translate('LOGIN.LITE_MODE_ONLY_DESC_P4') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-40 text-left bw-inverted">
                        { translate('LOGIN.LITE_MODE_ONLY_DESC_P5') }
                      </h4>
                    </div>
                  }
                  { this.state.walletType === 'native' &&
                    <div>
                      <h4 className="hint color-white padding-top-10 margin-bottom-20 text-left">
                        { translate('LOGIN.NATIVE_MODE_ONLY_DESC_P1') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-20 text-left">
                        { translate('LOGIN.NATIVE_MODE_ONLY_DESC_P2') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-20 text-left">
                        { translate('LOGIN.NATIVE_MODE_ONLY_DESC_P3') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-20 text-left">
                        { translate('LOGIN.NATIVE_MODE_ONLY_DESC_P4') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-40 text-left">
                        { translate('LOGIN.NATIVE_MODE_ONLY_DESC_P5') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-40 text-left bw-inverted">
                        { translate('LOGIN.NATIVE_MODE_ONLY_DESC_P6') }
                      </h4>
                    </div>
                  }
                  { this.state.walletType === 'multisig' &&
                    <div>
                      <h4 className="hint color-white padding-top-10 margin-bottom-20 text-left">
                        { translate('LOGIN.MULTISIG_DESC_P1') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-20 text-left">
                        { translate('LOGIN.MULTISIG_DESC_P2') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-20 text-left">
                        { translate('LOGIN.MULTISIG_DESC_P3') }
                      </h4>
                      <h4 className="hint color-white margin-bottom-20 text-left bw-inverted">
                        { translate('LOGIN.MULTISIG_DESC_P4') }
                      </h4>
                    </div>
                  }
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={ this.nextStep }>
                    { translate('LOGIN.NEXT') }
                  </button>
                  { this.state.walletType !== 'multisig' &&
                    <div className="form-group form-material floating">
                      <button
                        className="btn btn-lg btn-flat btn-block waves-effect"
                        id="register-back-btn"
                        onClick={ () => this.updateActiveLoginSection('login') }>
                        { translate('INDEX.BACK_TO_LOGIN') }
                      </button>
                    </div>
                  }
                </section>
              }
              { this.state.step === 1 &&
                this.state.walletType !== 'multisig' &&
                <section>
                  <h4 className="hint color-white padding-top-10 margin-bottom-20 text-left">
                    { translate('LOGIN.THIS_IS_YOUR_NEW_SEED_P1') }
                  </h4>
                  <h4 className="hint color-white margin-bottom-20 text-left">
                    { translate('LOGIN.THIS_IS_YOUR_NEW_SEED_P2') }
                  </h4>
                  <h4 className="hint color-white margin-bottom-20 text-left">
                    { translate('LOGIN.THIS_IS_YOUR_NEW_SEED_P3') }
                  </h4>
                  <h4 className="hint color-white margin-bottom-40 text-left">
                    { translate('LOGIN.THIS_IS_YOUR_NEW_SEED_P4') }
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
              { this.state.step === 2 &&
                this.state.walletType !== 'multisig' &&
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
                        <div className="seed-gen-box">
                          { renderCreateSeedWordsConfirmStack() }
                        </div>
                      </div>
                    }
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={ this.nextStep }>
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
              { ((this.state.step === 3 && this.state.walletType !== 'multisig') || (this.state.step === 5 && this.state.walletType === 'multisig')) &&
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
                  { this.state.walletType === 'multisig' &&
                    <div className="form-group form-material floating">
                      <button
                        className="btn btn-lg btn-flat btn-block waves-effect"
                        id="register-back-btn"
                        onClick={ () => this.updateActiveLoginSection('login') }>
                        { translate('INDEX.BACK_TO_LOGIN') }
                      </button>
                    </div>
                  }
                </section>
              }
              { this.state.step === 1 && // multisig
                this.state.walletType === 'multisig' &&
                <section className="restore-wallet">
                  <h4 className="hint color-white margin-bottom-60">
                    { translate('LOGIN.PROVIDE_YOUR_PRIV_OR_SEED') }
                  </h4>
                  <button onClick={ this.multisigTest }>test</button>
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
              { this.state.step === 2 &&
                this.state.walletType === 'multisig' &&
                <section className="restore-wallet">
                  <h4 className="hint color-white margin-bottom-20">
                    { translate('LOGIN.RESTORE_VERIFY_INFO') }
                  </h4>
                  <div className="form-group form-material create-wallet-seed margin-top-40">
                    <p className="text-center padding-bottom-10">{ translate('LOGIN.' + (isPrivKey(this.state.loginPassphrase) ? 'YOU_PROVIDED_PRIV_KEY' : 'YOU_PROVIDED_SEED')) }</p>
                    <p>
                      { translate('LOGIN.YOUR_PUB_IS', 'KMD') }
                      <span
                        className="pointer external-link"
                        onClick={ () => this.openExplorerWindow('kmd') }>
                        { isPrivKey(this.state.loginPassphrase) ? wifToWif(this.state.loginPassphrase || '', networks.kmd, true).pub : stringToWif(this.state.loginPassphrase || '', networks.kmd, true).pub }
                      </span>
                      <i
                        className="icon fa-copy"
                        onClick={ () => this.copyPubAddress('kmd') }></i>
                    </p>
                    <p>
                      { translate('LOGIN.YOUR_PUB_IS', 'BTC') }
                      <span
                        className="pointer external-link"
                        onClick={ () => this.openExplorerWindow('btc') }>
                        { isPrivKey(this.state.loginPassphrase) ? wifToWif(this.state.loginPassphrase || '', networks.btc, true).pub : stringToWif(this.state.loginPassphrase || '', networks.btc, true).pub }
                      </span>
                      <i
                        className="icon fa-copy"
                        onClick={ () => this.copyPubAddress('btc') }></i>
                    </p>
                    <p>
                      Your pubkey is
                      <br/>
                      <span className="selectable">
                        { isPrivKey(this.state.loginPassphrase) ? wifToWif(this.state.loginPassphrase || '', networks.btc, true).pubHex : stringToWif(this.state.loginPassphrase || '', networks.btc, true).pubHex }
                      </span>
                    </p>
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
              { this.state.step === 3 && // multisig
                this.state.walletType === 'multisig' &&
                <section className="restore-wallet">
                  <h4 className="hint color-white margin-bottom-40">
                    Choose number of required signatures and provide all pub keys below.
                  </h4>
                  <h4 className="hint color-white margin-bottom-40">Warning! Pubkeys order matters. Different order will produce different multi signature address.</h4>
                  <div className="form-group form-material floating col-sm-12 horizontal-padding-0 sigs-selector">
                    <select
                      name="nOfN"
                      className="col-sm-3"
                      value={ this.state.multisigCreateNofN }
                      onChange={ this.updateMultisigCreateNofN }>
                      <option value="1-2">1 of 2</option>
                      <option value="2-2">2 of 2</option>
                      <option value="2-3">2 of 3</option>
                      <option value="3-5">3 of 5</option>
                    </select>
                    <label
                      className="floating-label"
                      htmlFor="inputPassword">
                      { translate('TOOLS.NUM_OF_SIGS') }
                    </label>
                  </div>
                  <div className="form-group form-material floating col-sm-12 horizontal-padding-0 pubkeys">
                    { this.renderPubKeysForm() }
                  </div>
                  <div className="form-group form-material col-sm-12 horizontal-padding-0 padding-top-10">
                    <button
                      type="button"
                      className="btn btn-primary btn-block margin-top-30"
                      onClick={ this.nextStep }
                      disabled={ !this.multisigCreateValidatePubkeys() }>
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
              { this.state.step === 4 && // multisig
                this.state.walletType === 'multisig' &&
                <section className="restore-wallet">
                  <h4 className="hint color-white margin-bottom-40">
                    Please verify information below and share between co-signers.
                  </h4>
                  <div className="form-group form-material floating col-sm-12 horizontal-padding-0 sigs-selector">
                    <div>
                      <strong>Numer of required signatures: { this.state.multisigCreateNofN.replace('-', ' of ') }</strong>
                    </div>
                    <div className="padding-top-25">
                      <strong>Pubkeys list</strong>
                      <div>
                        { this.renderPubkeysList() } 
                      </div>
                    </div>
                    <div className="padding-top-30">
                      <strong>Redeem Script</strong>
                      <div className="padding-top-5 word-break--all selectable">{ this.state.multisigCreateData.redeemScript }</div>
                    </div>
                    <div className="padding-top-30">
                      <strong>KMD address:</strong> <span className="selectable">{ this.state.multisigCreateData.address }</span>
                    </div>
                    <div className="padding-top-30">
                      <strong>Secret key (3rd party service):</strong> <span className="selectable">{ this.state.multisigCreateSecret }</span>
                    </div>
                    <div className="padding-top-30">
                    <strong> Backup (share between co-signers)</strong>
                      <button
                        className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                        title={ translate('INDEX.COPY_TO_CLIPBOARD') }
                        onClick={ this.copyMultisigBackup }>
                        <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
                      </button>
                      <a
                        id="multisig-backup-link"
                        onClick={ this.dumpMultisigBackup }>
                        <button
                          className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
                          title="Download as a file">
                          <i className="icon fa-download"></i>
                        </button>
                      </a>
                      <div className="padding-top-10 word-break--all selectable">
                        { this.state.multisigCreateData.backupHex }
                      </div>
                    </div>
                    <div className="padding-top-30">
                      <strong>Make sure to pass backup information to all co-signers! Otherwise they won't be able to join multi signature wallet.</strong>
                    </div>
                  </div>
                  <div className="form-group form-material col-sm-12 horizontal-padding-0 padding-top-10">
                    <button
                      type="button"
                      className="btn btn-primary btn-block margin-top-30"
                      onClick={ this.nextStep }
                      disabled={ !this.multisigCreateValidatePubkeys() }>
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
            </div>
          </div>

          <div className={ this.state.activeLoginSection === 'restore' ? 'show' : 'hide' }>
            { this.state.step === 0 &&
              <section className="restore-wallet">
                <h4 className="hint color-white margin-bottom-40">
                  Choose a wallet type and provide a seed or a priv key.
                </h4>
                <select
                  className="form-control form-material margin-bottom-60"
                  name="walletType"
                  value={ this.state.walletType }
                  onChange={ (event) => this.updateInput(event) }
                  autoFocus>
                  <option value="default">
                    { translate('LOGIN.LITE_MODE_ONLY') }
                  </option>
                  <option value="multisig">
                    { translate('LOGIN.MULTISIG') }
                  </option>
                </select>
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
                  <i
                    className="icon fa-warning seed-extra-spaces-warning"
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
                  <p>
                    { translate('LOGIN.YOUR_PUB_IS', 'KMD') }
                    <span
                      className="pointer external-link"
                      onClick={ () => this.openExplorerWindow('kmd') }>
                      { isPrivKey(this.state.loginPassphrase) ? wifToWif(this.state.loginPassphrase || '', networks.kmd, true).pub : stringToWif(this.state.loginPassphrase || '', networks.kmd, true).pub }
                    </span>
                    <i
                      className="icon fa-copy"
                      onClick={ () => this.copyPubAddress('kmd') }></i>
                  </p>
                  <p>
                    { translate('LOGIN.YOUR_PUB_IS', 'BTC') }
                    <span
                      className="pointer external-link"
                      onClick={ () => this.openExplorerWindow('btc') }>
                      { isPrivKey(this.state.loginPassphrase) ? wifToWif(this.state.loginPassphrase || '', networks.btc, true).pub : stringToWif(this.state.loginPassphrase || '', networks.btc, true).pub }
                    </span>
                    <i
                      className="icon fa-copy"
                      onClick={ () => this.copyPubAddress('btc') }></i>
                  </p>
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
                <div className="form-group form-material floating">
                  <button
                    className="btn btn-lg btn-flat btn-block waves-effect"
                    id="register-back-btn"
                    onClick={ () => this.updateActiveLoginSection('login') }>
                    { translate('INDEX.BACK_TO_LOGIN') }
                  </button>
                </div>
              </section>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRender;