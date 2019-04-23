import React from 'react';
import { connect } from 'react-redux';
import {
  toggleAddcoinModal,
  apiElectrumAuth,
  apiElectrumCoins,
  apiEthereumAuth,
  apiEthereumCoins,
  startInterval,
  getDexCoins,
  triggerToaster,
  toggleLoginSettingsModal,
  stopInterval,
  dashboardChangeActiveCoin,
  toggleZcparamsFetchModal,
  toggleNotaryElectionsModal,
  activeHandle,
  encryptPassphrase,
  loadPinList,
  loginWithPin,
  apiElectrumLogout,
  dashboardRemoveCoin,
  dashboardChangeSectionState,
  toggleDashboardActiveSection,
  copyString,
} from '../../actions/actionCreators';
import Config from '../../config';
import Store from '../../store';
import zcashParamsCheckErrors from '../../util/zcashParams';
import LoginRender from './login.render';
import translate from '../../translate/translate';
import mainWindow, { staticVar } from '../../util/mainWindow';
import passphraseGenerator from 'agama-wallet-lib/src/crypto/passphrasegenerator';
import md5 from 'agama-wallet-lib/src/crypto/md5';
import { msigPubAddress } from 'agama-wallet-lib/src/keys';
import networks from 'agama-wallet-lib/src/bitcoinjs-networks';
import { shuffleArray } from 'agama-wallet-lib/src/crypto/utils';
import nnConfig from '../nnConfig';

const SEED_TRIM_TIMEOUT = 5000;

// TODO: create/restore wallet msig, offline sig, watch only support

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      display: false,
      activeLoginSection: staticVar.argv.indexOf('hardcore') > -1 ? 'login' : 'activateCoin',
      loginPassphrase: '',
      seedInputVisibility: false,
      loginPassPhraseSeedType: null,
      bitsOption: 256,
      randomSeed: '',
      randomSeedShuffled: '',
      randomSeedConfirm: [],
      isSeedConfirmError: false,
      isSeedBlank: false,
      displaySeedBackupModal: false,
      customWalletSeed: false,
      isCustomSeedWeak: false,
      trimPassphraseTimer: null,
      displayLoginSettingsDropdown: false,
      displayLoginSettingsDropdownSection: null,
      shouldEncryptSeed: true,
      encryptKey: '',
      encryptKeyConfirm: '',
      decryptKey: '',
      selectedPin: '',
      isExperimentalOn: false,
      enableEncryptSeed: true,
      isCustomPinFilename: true,
      customPinFilename: '',
      selectedShortcutNative: '',
      selectedShortcutSPV: '',
      seedExtraSpaces: false,
      step: 0,
    };
    this.defaultState = JSON.parse(JSON.stringify(this.state));
    this.toggleActivateCoinForm = this.toggleActivateCoinForm.bind(this);
    this.updateRegisterConfirmPassPhraseInput = this.updateRegisterConfirmPassPhraseInput.bind(this);
    this.updateLoginPassPhraseInput = this.updateLoginPassPhraseInput.bind(this);
    this.loginSeed = this.loginSeed.bind(this);
    this.toggleSeedInputVisibility = this.toggleSeedInputVisibility.bind(this);
    this.handleRegisterWallet = this.handleRegisterWallet.bind(this);
    this.toggleSeedBackupModal = this.toggleSeedBackupModal.bind(this);
    this.copyPassPhraseToClipboard = this.copyPassPhraseToClipboard.bind(this);
    this.execWalletCreate = this.execWalletCreate.bind(this);
    this.toggleLoginSettingsDropdown = this.toggleLoginSettingsDropdown.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.loadPinList = this.loadPinList.bind(this);
    this.updateSelectedShortcut = this.updateSelectedShortcut.bind(this);
    this.setRecieverFromScan = this.setRecieverFromScan.bind(this);
    this.toggleCustomPinFilename = this.toggleCustomPinFilename.bind(this);
    this.resetSPVCoins = this.resetSPVCoins.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.createSeedConfirmPush = this.createSeedConfirmPush.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.clearCreateSeedConfirm = this.clearCreateSeedConfirm.bind(this);
    this.popCreateSeedConfirm = this.popCreateSeedConfirm.bind(this);
  }

  popCreateSeedConfirm() {
    let randomSeedConfirm = JSON.parse(JSON.stringify(this.state.randomSeedConfirm));
    randomSeedConfirm.pop();

    this.setState({
      randomSeedConfirm,
    });
  }

  clearCreateSeedConfirm() {
    this.setState({
      randomSeedConfirm: [],
    });
  }

  createSeedConfirmPush(word) {
    let randomSeedConfirm = JSON.parse(JSON.stringify(this.state.randomSeedConfirm));

    randomSeedConfirm.push(word);    

    this.setState({
      randomSeedConfirm,
    });
  }

  handleClickOutside(e) {
    if (e &&
        e.srcElement &&
        e.srcElement.offsetParent) {
      this.setState({
        displayLoginSettingsDropdown: e.srcElement.className.indexOf('login-settings-dropdown-label') === -1 || !this.state.displayLoginSettingsDropdown ? false : true,
      });
    }
  }

  renderResetSPVCoinsOption() {
    if (this.props.Main &&
        this.props.Main.coins &&
        this.props.Main.coins.spv &&
        this.props.Main.coins.spv.length) {
      return true;
    }
  }

  resetSPVCoins() {
    this.setState({
      displayLoginSettingsDropdown: false,
    });

    apiElectrumLogout()
    .then((res) => {
      const _spvCoins = this.props.Main.coins.spv;

      mainWindow.pinAccess = false;
      mainWindow.multisig = null;

      if (!this.props.Main.coins.native.length) {
        Store.dispatch(dashboardChangeActiveCoin(
          null,
          null,
          true
        ));
      }

      setTimeout(() => {
        for (let i = 0; i < _spvCoins.length; i++) {
          Store.dispatch(dashboardRemoveCoin(_spvCoins[i]));
        }

        if (!this.props.Main.coins.native.length) {
          Store.dispatch(dashboardChangeActiveCoin(
            null,
            null,
            true
          ));
        }

        Store.dispatch(getDexCoins());
        Store.dispatch(activeHandle());

        if (this.props.Main.coins.native.length) {
          Store.dispatch(dashboardChangeActiveCoin(
            this.props.Main.coins.native[0],
            'native'
          ));    
        }
      }, 500);

      Store.dispatch(getDexCoins());
      Store.dispatch(activeHandle());
      Store.dispatch(dashboardChangeActiveCoin());
    });
  }

  _toggleNotaryElectionsModal() {
    this.setState({
      displayLoginSettingsDropdown: false,
    });
    Store.dispatch(toggleNotaryElectionsModal(true));
  }

  toggleLoginSettingsDropdownSection(sectionName) {
    if (sectionName === 'elections') {
      this._toggleNotaryElectionsModal();
    } else {
      Store.dispatch(toggleLoginSettingsModal(true));

      this.setState({
        displayLoginSettingsDropdown: false,
        displayLoginSettingsDropdownSection: sectionName,
      });
    }
  }

  setRecieverFromScan(receiver) {
    if (receiver) {
      this.setState({
        loginPassphrase: receiver,
      });
    } else {
      Store.dispatch(
        triggerToaster(
          translate('LOGIN.QR_UNABLE_TO_DECODE'),
          translate('INDEX.QR_ERROR'),
          'error'
        )
      );
    }
  }

  isCustomWalletSeed() {
    return this.state.customWalletSeed;
  }

  toggleCustomWalletSeed() {
    this.setState({
      customWalletSeed: !this.state.customWalletSeed,
    }, () => {
      // if customWalletSeed is set to false, regenerate the seed
      if (!this.state.customWalletSeed) {
        this.setState({
          randomSeed: passphraseGenerator.generatePassPhrase(this.state.bitsOption),
          isSeedConfirmError: false,
          isSeedBlank: false,
          isCustomSeedWeak: false,
        });
      } else {
        // if customWalletSeed is set to true, reset to seed to an empty string
        this.setState({
          randomSeed: '',
          randomSeedConfirm: [],
        });
      }
    });
  }

  shouldEncryptSeed() {
    return this.state.shouldEncryptSeed;
  }

  toggleShouldEncryptSeed() {
    this.setState({
      shouldEncryptSeed: !this.state.shouldEncryptSeed,
    });
  }

  toggleCustomPinFilename() {
    this.setState({
      isCustomPinFilename: !this.state.isCustomPinFilename,
    });
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  componentDidMount() {
    const newSeed = passphraseGenerator.generatePassPhrase(256);

    this.setState({
      isExperimentalOn: mainWindow.userAgreement,
      randomSeed: newSeed,
      randomSeedShuffled: shuffleArray(newSeed.split(' ')),
    });

    this.loadPinList();
  }

  toggleSeedInputVisibility() {
    this.setState({
      seedInputVisibility: !this.state.seedInputVisibility,
    });
  }

  generateNewSeed(bits) {
    const newSeed = passphraseGenerator.generatePassPhrase(bits);

    this.setState(Object.assign({}, this.state, {
      randomSeed: newSeed,
      randomSeedShuffled: shuffleArray(newSeed.split(' ')),
      bitsOption: bits,
      isSeedBlank: false,
    }));
  }

  toggleLoginSettingsDropdown() {
    this.setState(Object.assign({}, this.state, {
      displayLoginSettingsDropdown: !this.state.displayLoginSettingsDropdown,
    }));
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  componentWillReceiveProps(props) {
    if (props.Login.pinList === 'no pins') {
      props.Login.pinList = [];
    }

    if (props.Login.pinList !== 'no pins' &&
        props.Login.pinList.length === 1) {
      setTimeout(() => {
        this.setState({
          selectedPin: props.Login.pinList[0],
        });
      }, 100);
    }

    if (props &&
        props.Main &&
        props.Main.isLoggedIn) {
      if (props.Main.total === 0) {
        this.setState({
          activeLoginSection: staticVar.argv.indexOf('hardcore') > -1 ? 'login' : 'activateCoin',
          loginPassphrase: '',
          display: true,
        });
      } else {
        this.setState({
          loginPassphrase: '',
          display: false,
        });
      }
    }

    if (props &&
        props.Main &&
        !props.Main.isLoggedIn) {
      document.body.className = 'page-login layout-full page-dark';

      if (props.Interval &&
          props.Interval.interval &&
          props.Interval.interval.sync) {
        Store.dispatch(dashboardChangeActiveCoin());
        Store.dispatch(
          stopInterval(
            'sync',
            props.Interval.interval
          )
        );
      }

      this.setState({
        display: true,
        activeLoginSection: this.state.activeLoginSection !== 'signup' && this.state.activeLoginSection !== 'restore' ? 'login' : this.state.activeLoginSection,
      });
    }

    if (props.Main &&
        props.Main.total === 0) {
      document.body.className = 'page-login layout-full page-dark';

      if (props.Interval &&
          props.Interval.interval &&
          props.Interval.interval.sync) {
        Store.dispatch(dashboardChangeActiveCoin());
        Store.dispatch(
          stopInterval(
            'sync',
            props.Interval.interval
          )
        );
      }
    }

    if (this.state.activeLoginSection !== 'signup' &&
        this.state.activeLoginSection !== 'restore' &&
        props &&
        props.Main &&
        props.Main.isLoggedIn) {
      this.setState({
        loginPassphrase: '',
        activeLoginSection: staticVar.argv.indexOf('hardcore') > -1 ? 'login' : 'activateCoin',
      });
    }
  }

  toggleActivateCoinForm() {
    Store.dispatch(toggleAddcoinModal(true, false));
  }

  updateLoginPassPhraseInput(e) {
    clearTimeout(this.state.trimPassphraseTimer);
    
    const newValue = e.target.value;
    const _trimPassphraseTimer = setTimeout(() => {
      if (newValue[0] === ' ' ||
          newValue[newValue.length - 1] === ' ') {
        this.setState({
          seedExtraSpaces: true,
        });
      } else {
        this.setState({
          seedExtraSpaces: false,
        });
      }
    }, SEED_TRIM_TIMEOUT);

    this.setState({
      seedExtraSpaces: false,
      trimPassphraseTimer: _trimPassphraseTimer,
      [e.target.name]: newValue,
      loginPassPhraseSeedType: this.getLoginPassPhraseSeedType(newValue),
    });
  }

  updateRegisterConfirmPassPhraseInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
      isSeedConfirmError: false,
      isSeedBlank: this.isBlank(e.target.value),
    });
  }

  updateWalletSeed(e) {
    this.setState({
      randomSeed: e.target.value,
      isSeedConfirmError: false,
      isSeedBlank: this.isBlank(e.target.value),
    });
  }

  loginSeed() {
    if (!this.state.selectedPin ||
        !this.state.decryptKey) {
      const stringEntropy = mainWindow.checkStringEntropy(this.state.loginPassphrase);

      mainWindow.pinAccess = false;
      mainWindow.multisig = null;

      if (!stringEntropy) {
        Store.dispatch(
          triggerToaster(
            [translate('LOGIN.SEED_ENTROPY_CHECK_LOGIN_P1'),
              '',
              translate('LOGIN.SEED_ENTROPY_CHECK_LOGIN_P2')],
            translate('LOGIN.SEED_ENTROPY_CHECK_TITLE'),
            'warning toastr-wide',
            false
          )
        );
      }

      mainWindow.createSeed.secondaryLoginPH = md5(this.state.loginPassphrase);
      // reset the login pass phrase values so that when the user logs out, the values are clear
      this.setState({
        loginPassphrase: '',
        loginPassPhraseSeedType: null,
      });

      // reset login input vals
      if (this.refs.loginPassphrase) {
        this.refs.loginPassphrase.value = '';
      }

      this.setState(this.defaultState);

      // TODO: trigger based on ETH/electrum
      Store.dispatch(dashboardChangeSectionState('wallets'));
      Store.dispatch(toggleDashboardActiveSection('default'));
      Store.dispatch(apiEthereumAuth(this.state.loginPassphrase));
      Store.dispatch(apiElectrumAuth(this.state.loginPassphrase));
      Store.dispatch(apiElectrumCoins());
      Store.dispatch(apiEthereumCoins());
    } else {
      mainWindow.pinAccess = this.state.selectedPin;

      loginWithPin(this.state.decryptKey, this.state.selectedPin)
      .then((res) => {
        if (res.msg === 'success') {
          if (res.result.indexOf('msig:') > -1) {
            const _data = res.result.split('msig:');

            try {
              mainWindow.multisig = JSON.parse(_data[1]);
              
              const _coins = this.props.Main.coins.spv;

              if (_coins.length) {
                let _addressSet = false;
                mainWindow.multisig.addresses = {};

                if (_coins.indexOf('KMD') > -1) {
                  res.result = msigPubAddress(mainWindow.multisig.scriptPubKey, networks.kmd);
                  _addressSet = true;
                }

                for (let i = 0; i < _coins.length; i++) {
                  mainWindow.multisig.addresses[_coins[i]] = msigPubAddress(mainWindow.multisig.scriptPubKey, networks[_coins[i].toLowerCase()] || networks.kmd);
                  
                  if (!_addressSet &&
                      i === 0) {
                    res.result = mainWindow.multisig.addresses[_coins[i]];
                    _addressSet = true;
                  }
                }

                res.result = msigPubAddress(mainWindow.multisig.scriptPubKey, networks.kmd);
              }
            } catch (e) {
              console.warn('unable to parse multisig data from pin');
            }
          }
          // reset login input vals
          if (staticVar.argv.indexOf('hardcore') > -1) {
            this.refs.loginPassphrase.value = '';
          }
          this.refs.decryptKey.value = '';

          this.setState(this.defaultState);

          Store.dispatch(dashboardChangeSectionState('wallets'));
          Store.dispatch(toggleDashboardActiveSection('default'));
          Store.dispatch(apiElectrumAuth(res.result));
          Store.dispatch(apiElectrumCoins());
          Store.dispatch(apiEthereumAuth(res.result));
          Store.dispatch(apiEthereumCoins());
        }
      });
    }
  }

  loadPinList() {
    Store.dispatch(loadPinList());
  }

  updateSelectedPin(selectedPin) {
    this.setState({
      selectedPin,
    });
  }

  getLoginPassPhraseSeedType(passPhrase) {
    if (!passPhrase) {
      return null;
    }

    const passPhraseWords = passPhrase.split(' ');

    if (!passphraseGenerator.arePassPhraseWordsValid(passPhrase)) {
      return null;
    }

    if (passphraseGenerator.isPassPhraseValid(passPhraseWords, 256)) {
      return translate('LOGIN.IGUANA_SEED');
    }

    if (passphraseGenerator.isPassPhraseValid(passPhraseWords, 160)) {
      return translate('LOGIN.WAVES_SEED');
    }

    if (passphraseGenerator.isPassPhraseValid(passPhraseWords, 128)) {
      return translate('LOGIN.NXT_SEED');
    }

    return null;
  }

  updateActiveLoginSection(name) {
    const newSeed = passphraseGenerator.generatePassPhrase(256);
    // reset login/create form
    this.setState({
      activeLoginSection: name,
      loginPassphrase: null,
      loginPassPhraseSeedType: null,
      seedInputVisibility: false,
      bitsOption: 256,
      randomSeed: newSeed,
      randomSeedShuffled: shuffleArray(newSeed.split(' ')),
      randomSeedConfirm: [],
      isSeedConfirmError: false,
      isSeedBlank: false,
      displaySeedBackupModal: false,
      customWalletSeed: false,
      isCustomSeedWeak: false,
      step: 0,
    });
  }

  execWalletCreate() {
    mainWindow.createSeed.triggered = true;
    mainWindow.createSeed.firstLoginPH = md5(this.state.randomSeed);

    Store.dispatch(
      apiElectrumAuth(this.state.randomSeedConfirm)
    );
    Store.dispatch(
      apiElectrumCoins()
    );

    this.setState({
      activeLoginSection: staticVar.argv.indexOf('hardcore') > -1 ? 'login' : 'activateCoin',
      displaySeedBackupModal: false,
      isSeedConfirmError: false,
    });
  }

  prevStep() {
    if (this.state.activeLoginSection === 'signup') {
      const newSeed = passphraseGenerator.generatePassPhrase(256);

      this.setState({
        step: this.state.step - 1,
        randomSeedConfirm: [],
        randomSeed: newSeed,
        randomSeedShuffled: shuffleArray(newSeed.split(' ')),
      });
    } else {
      this.setState({
        step: this.state.step - 1,
        loginPassphrase: null,
      });
    }
  }

  nextStep() {
    if (this.state.activeLoginSection === 'restore' &&
        this.state.step === 0) {
      const stringEntropy = mainWindow.checkStringEntropy(this.state.loginPassphrase);
      
      if (!stringEntropy) {
        Store.dispatch(
          triggerToaster(
            [translate('LOGIN.SEED_ENTROPY_CHECK_LOGIN_P1'),
              '',
              translate('LOGIN.SEED_ENTROPY_CHECK_LOGIN_P2')],
            translate('LOGIN.SEED_ENTROPY_CHECK_TITLE'),
            'warning toastr-wide',
            false
          )
        );
      } else {
        this.setState({
          step: this.state.step + 1,
        });
      }
    } else {
      this.setState({
        step: this.state.step + 1,
      });
    }
  }

  handleRegisterWallet() {
    const _seed = this.state.activeLoginSection === 'signup' ? this.state.randomSeed : this.state.loginPassphrase;
    const enteredSeedsMatch = this.state.activeLoginSection === 'signup' ? this.state.randomSeed === this.state.randomSeedConfirm.join(' ') : true;
    const isSeedBlank = this.state.activeLoginSection === 'signup' ? this.isBlank(this.state.randomSeed) : false;
    const stringEntropy = this.state.activeLoginSection === 'signup' ? mainWindow.checkStringEntropy(this.state.randomSeed) : true;

    if (!stringEntropy) {
      Store.dispatch(
        triggerToaster(
          [translate('LOGIN.SEED_ENTROPY_CHECK_P1'),
            '',
            translate('LOGIN.SEED_ENTROPY_CHECK_P3')],
            translate('LOGIN.SEED_ENTROPY_CHECK_TITLE'),
          'warning toastr-wide',
          false
        )
      );
    }

    this.setState({
      isSeedConfirmError: !enteredSeedsMatch ? true : false,
      isSeedBlank: isSeedBlank ? true : false,
    });

    if (this.state.shouldEncryptSeed) {
      if (this.state.encryptKey !== this.state.encryptKeyConfirm) {
        Store.dispatch(
          triggerToaster(
            translate('LOGIN.ENCRYPTION_KEYS_DONT_MATCH'),
            translate('LOGIN.SEED_ENCRYPT'),
            'error'
          )
        );
      } else {
        if (!this.state.encryptKey ||
            !this.state.encryptKeyConfirm) {
          Store.dispatch(
            triggerToaster(
              translate('LOGIN.ENCRYPTION_KEY_EMPTY'),
              translate('LOGIN.SEED_ENCRYPT'),
              'error'
            )
          );
        } else if (this.state.encryptKey === this.state.encryptKeyConfirm) {
          const seedEncryptionKeyEntropy = mainWindow.checkStringEntropy(this.state.encryptKey);

          if (!seedEncryptionKeyEntropy) {
            Store.dispatch(
              triggerToaster(
                translate('LOGIN.SEED_ENCRYPTION_WEAK_PW'),
                translate('LOGIN.WEAK_PW'),
                'error'
              )
            );
          } else {
            if (this.state.isCustomPinFilename) {
              const _customPinFilenameTest = /^[0-9a-zA-Z-_]+$/g;

              if (this.state.customPinFilename &&
                  _customPinFilenameTest.test(this.state.customPinFilename)) {
                encryptPassphrase(
                  this.state.activeLoginSection === 'signup' ? this.state.randomSeed : this.state.loginPassphrase,
                  this.state.encryptKey,
                  false,
                  this.state.customPinFilename,
                )
                .then((res) => {
                  if (res.msg === 'success') {
                    this.loadPinList();

                    setTimeout(() => {
                      this.setState({
                        selectedPin: res.result,
                        activeLoginSection: 'login',
                        randomSeed: '',
                        loginPassphrase: '',
                        randomSeedConfirm: [],
                        customWalletSeed: false,
                        encryptKey: '',
                        encryptKeyConfirm: '',
                        decryptKey: '',
                      });
                    }, 500);
                  } else {
                    Store.dispatch(
                      triggerToaster(
                        res.result,
                        translate('LOGIN.ERR_SEED_STORAGE'),
                        'error'
                      )
                    );
                  }
                });
              } else {
                Store.dispatch(
                  triggerToaster(
                    translate('LOGIN.CUSTOM_PIN_FNAME_INFO'),
                    translate('LOGIN.ERR_SEED_STORAGE'),
                    'error'
                  )
                );
              }
            } else {
              encryptPassphrase(
                this.state.activeLoginSection === 'signup' ? this.state.randomSeed : this.state.loginPassphrase,
                this.state.encryptKey
              )
              .then((res) => {
                if (res.msg === 'success') {
                  this.loadPinList();

                  setTimeout(() => {
                    this.setState({
                      selectedPin: res.result,
                      activeLoginSection: 'login',
                      randomSeed: '',
                      loginPassphrase: '',
                      randomSeedConfirm: [],
                      customWalletSeed: false,
                      encryptKey: '',
                      encryptKeyConfirm: '',
                      decryptKey: '',
                    });
                  }, 500);
                } else {
                  Store.dispatch(
                    triggerToaster(
                      res.result,
                      translate('LOGIN.ERR_SEED_STORAGE'),
                      'error'
                    )
                  );
                }
              });
            }
          }
        }
      }
    }
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  handleKeydown(e) {
    this.updateLoginPassPhraseInput(e);

    if (e.key === 'Enter' &&
        (this.state.loginPassphrase || (this.state.selectedPin && this.state.decryptKey))) {
      this.loginSeed();
    }
  }

  toggleSeedBackupModal() {
    this.setState(Object.assign({}, this.state, {
      displaySeedBackupModal: !this.state.displaySeedBackupModal,
    }));
  }

  copyPassPhraseToClipboard() {
    Store.dispatch(copyString(this.state.randomSeed, translate('LOGIN.SEED_SUCCESSFULLY_COPIED')));
  }

  updateSelectedShortcut(e, type) {
    this.setState({
      [type === 'native' ? 'selectedShortcutNative' : 'selectedShortcutSPV'] : e.value,
    });

    if (type === 'native') {
      const _res = mainWindow.zcashParamsExist;
      const __errors = zcashParamsCheckErrors(_res);

      if (__errors) {
        mainWindow.zcashParamsExistPromise()
        .then((res) => {
          const _errors = zcashParamsCheckErrors(res);
          mainWindow.zcashParamsExist = res;

          if (_errors) {
            Store.dispatch(
              triggerToaster(
                _errors,
                'Komodod',
                'error',
                false
              )
            );
            Store.dispatch(toggleZcparamsFetchModal(true));
          } else {
            mainWindow.startKMDNative(e.value.toUpperCase());
          }
        });
      } else {
        mainWindow.startKMDNative(e.value.toUpperCase());
        this.setState({
          selectedShortcutNative: '',
        });
      }
    } else {
      mainWindow.startSPV(e.value.toUpperCase());
      this.setState({
        selectedShortcutSPV: '',
      });
    }

    setTimeout(() => {
      Store.dispatch(activeHandle());
      if (type !== 'native') {
        Store.dispatch(apiElectrumCoins());
      }
      Store.dispatch(getDexCoins());
    }, 500);
    setTimeout(() => {
      Store.dispatch(activeHandle());
      if (type !== 'native') {
        Store.dispatch(apiElectrumCoins());
      }
      Store.dispatch(getDexCoins());
    }, 1000);
    setTimeout(() => {
      Store.dispatch(activeHandle());
      if (type !== 'native') {
        Store.dispatch(apiElectrumCoins());
      }
      Store.dispatch(getDexCoins());
    }, type === 'native' ? 5000 : 2000);
  }

  renderPinsList() {
    const _pins = this.props.Login.pinList;
    let _items = [];

    for (let i = 0; i < _pins.length; i++) {
      _items.push(
        <option
          className="login-option"
          value={ _pins[i] }
          key={ _pins[i] }>
          { _pins[i] }
        </option>
      );
    }

    return _items;
  }

  renderShortcutOption(option) {
    if (option.value.indexOf('+') > -1) {
      const _comps = option.value.split('+');
      let _items = [];

      for (let i = 0; i < _comps.length; i++) {
        _items.push(
          <span key={ `addcoin-shortcut-icons-${i}` }>
            <img
              src={ `assets/images/cryptologo/btc/${_comps[i].toLowerCase()}.png` }
              alt={ _comps[i].toUpperCase() }
              width="30px"
              height="30px" />
            { i !== _comps.length - 1 &&
              <span className="margin-left-10 margin-right-10">+</span>
            }
          </span>
        );
      }

      return _items;
    } else {
      return (
        <div>
          <img
            src={ `assets/images/cryptologo/btc/${option.value.toLowerCase()}.png` }
            alt={ option.value.toUpperCase() }
            width="30px"
            height="30px" />
          <span className="margin-left-10">{ option.value.toUpperCase() }</span>
        </div>
      );
    }
  }

  renderPinList() {
    const pins = this.props.Login.pinList;
    let items = [];

    for (let i = 0; i < pins.length; i++) {
      items.push(
        <div
          onClick={ () => this.updateSelectedPin(pins[i]) }
          key={ `login-pin-list-items-${i}` }
          className={ 'pin-list-item' + (this.state.selectedPin === pins[i] ? ' active' : '') }>
          { pins[i] }
        </div>
      );
    }
    
    return (
      <div className="pin-list">
        <div className="pin-list-inner">
          { items }
        </div>
      </div>
    );
  }

  render() {
    if ((this.state && this.state.display) ||
        !this.props.Main) {
      return LoginRender.call(this);
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    Dashboard: state.Dashboard,
    Interval: {
      interval: state.Interval.interval,
    },
    Login: state.Login,
  };
};

export default connect(mapStateToProps)(Login);