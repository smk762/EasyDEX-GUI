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
  apiLogout,
  clearActiveCoinStore,
  dashboardRemoveCoin,
  dashboardChangeSectionState,
  toggleDashboardActiveSection,
  // addcoin logic
  addCoin,
  addCoinEth,
} from '../../actions/actionCreators';
import Config from '../../config';
import Store from '../../store';
import LoginRender from './login.render';
import translate from '../../translate/translate';
import mainWindow, { staticVar } from '../../util/mainWindow';
import passphraseGenerator from 'agama-wallet-lib/src/crypto/passphrasegenerator';
import md5 from 'agama-wallet-lib/src/crypto/md5';
import {
  msigPubAddress,
  pubkeyToAddress,
} from 'agama-wallet-lib/src/keys';
import networks from 'agama-wallet-lib/src/bitcoinjs-networks';
import { shuffleArray } from 'agama-wallet-lib/src/crypto/utils';
import nnConfig from '../nnConfig';
import zcashParamsCheckErrors from '../../util/zcashParams';

const SEED_TRIM_TIMEOUT = 5000;
const modeToValue = {
  spv: 0,
  native: -1,
  eth: 3,
};

// TODO: create/restore wallet msig, offline sig, watch only support

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      display: false,
      activeLoginSection: staticVar.argv.indexOf('hardcore') > -1 ? 'login' : 'activateCoin',
      loginPassphrase: '',
      seedInputVisibility: false,
      bitsOption: 256,
      randomSeed: '',
      randomSeedShuffled: '',
      randomSeedConfirm: [],
      isSeedConfirmError: false,
      isSeedBlank: false,
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
      walletType: 'default',
    };
    this.coins = {};
    this.defaultState = JSON.parse(JSON.stringify(this.state));
    this.toggleActivateCoinForm = this.toggleActivateCoinForm.bind(this);
    this.updateRegisterConfirmPassPhraseInput = this.updateRegisterConfirmPassPhraseInput.bind(this);
    this.updateLoginPassPhraseInput = this.updateLoginPassPhraseInput.bind(this);
    this.loginSeed = this.loginSeed.bind(this);
    this.toggleSeedInputVisibility = this.toggleSeedInputVisibility.bind(this);
    this.handleRegisterWallet = this.handleRegisterWallet.bind(this);
    this.execWalletCreate = this.execWalletCreate.bind(this);
    this.toggleLoginSettingsDropdown = this.toggleLoginSettingsDropdown.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.loadPinList = this.loadPinList.bind(this);
    this.updateSelectedShortcut = this.updateSelectedShortcut.bind(this);
    this.setRecieverFromScan = this.setRecieverFromScan.bind(this);
    this.logout = this.logout.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.createSeedConfirmPush = this.createSeedConfirmPush.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.clearCreateSeedConfirm = this.clearCreateSeedConfirm.bind(this);
    this.popCreateSeedConfirm = this.popCreateSeedConfirm.bind(this);
    this.verifyZcashParamsExist = this.verifyZcashParamsExist.bind(this);
  }

  activateAllCoins() {
    const _activateAllCoins = () => {
      let _i = 0;
      
      for (let key in this.coins) {
        _i++;
        let _coin = this.coins[key];
        let coin = _coin.value;
        let coinuc = coin.toUpperCase();
  
        setTimeout(() => {
          if (!_coin.params) {
            if (_coin.value.indexOf('ETH') > -1 ||
                _coin.value === 'ETH') {
              const _ethNet = _coin.coin.value.split('|');
  
              Store.dispatch(addCoinEth(
                _ethNet[0],
                _ethNet[1],
                true
              ));
            } else {
              Store.dispatch(addCoin(
                coin,
                modeToValue[_coin.mode],
                null,
                null,
                null,
                true
              ));
            }
          } else {
            Store.dispatch(addCoin(
              coin,
              modeToValue[_coin.mode],
              { type: _coin.params.daemonParam },
              _coin.params.daemonParam === 'gen' &&
              staticVar.chainParams[coinuc] &&
              staticVar.chainParams[coinuc].genproclimit ? Number(_coin.params.genProcLimit || 1) : 0,
              _coin.params.usePubkey && pubkeyToAddress(Config.pubkey, networks.kmd) ? Config.pubkey : null,
              true
            ));
          }
        }, (_coin.mode === 'native' ? 2000 : 0) * (_i - 1));
      }
    };

    let isNativeModeCoin;

    for (let key in this.coins) {
      if (this.coins[key].mode === 'native') {
        isNativeModeCoin = true;
        break;
      }
    }

    if (isNativeModeCoin) {
      this.verifyZcashParamsExist(-1)
      .then((res) => {
        if (res) {
          _activateAllCoins();
        }
      });
    } else {
      _activateAllCoins();
    }
  }

  verifyZcashParamsExist(mode) {
    return new Promise((resolve, reject) => {
      if (Number(mode) === -1 ||
          Number(mode) === 1 ||
          Number(mode) === 2) {
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
              Store.dispatch(toggleZcparamsFetchModal(true));
              resolve(false);
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
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

  renderLogoutOption() {
    if (this.props.Main &&
        (this.props.Main.isLoggedIn || this.props.Main.isPin)) {
      return true;
    }
  }

  logout() {
    this.setState({
      displayLoginSettingsDropdown: false,
    });

    apiLogout()
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
      Store.dispatch(clearActiveCoinStore());
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
        (props.Main.isLoggedIn || props.Main.isPin)) {
      if (props.Main.total === 0) {
        this.setState({
          activeLoginSection: 'activateCoin',
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

      if (staticVar.argv.indexOf('hardcore') > -1) {
        this.setState({
          display: true,
          activeLoginSection: 'login',
        });
      } else {
        this.setState({
          display: true,
          activeLoginSection: this.state.activeLoginSection !== 'signup' && this.state.activeLoginSection !== 'restore' ? 'login' : this.state.activeLoginSection,
        });
      }
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
        (props.Main.isLoggedIn || props.Main.isPin)) {
      this.setState({
        loginPassphrase: '',
        activeLoginSection: 'activateCoin',
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
    this.coins = {};

    // ol' good seed/wif type in access
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

      // reset login input vals
      if (this.refs.loginPassphrase) {
        this.refs.loginPassphrase.value = '';
      }

      this.setState(this.defaultState);
      setTimeout(() => {
        this.setState({
          activeLoginSection: 'activateCoin',
        });
      }, 50);

      // TODO: trigger based on ETH/electrum
      Store.dispatch(dashboardChangeSectionState('wallets'));
      Store.dispatch(toggleDashboardActiveSection('default'));
      Store.dispatch(apiEthereumAuth(this.state.loginPassphrase));
      Store.dispatch(apiElectrumAuth(this.state.loginPassphrase));
      Store.dispatch(apiElectrumCoins());
      Store.dispatch(apiEthereumCoins());
    } else {
      mainWindow.pinAccess = this.state.selectedPin;

      loginWithPin(
        this.state.decryptKey,
        this.state.selectedPin
      )
      .then((res) => {
        if (res.msg === 'success') {
          Store.dispatch(activeHandle());
          /*if (res.result.seed.indexOf('msig:') > -1) {
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
          }*/
          // reset login input vals
          if (staticVar.argv.indexOf('hardcore') > -1) {
            this.refs.loginPassphrase.value = '';
          }
          this.refs.decryptKey.value = '';

          this.setState(this.defaultState);

          Store.dispatch(dashboardChangeSectionState('wallets'));
          Store.dispatch(toggleDashboardActiveSection('default'));
          
          if (res.result.type === 'default') {
            Store.dispatch(apiElectrumAuth(res.result.data.keys.seed));
          }

          const _coinsFromStorage = res.result.data.coins;
          if (Object.keys(_coinsFromStorage).length) {
            const modes = []

            // an extra check to make sure native/lite mode coins are not running together
            if (!_coinsFromStorage.native.length) {
              modes.push('spv', 'eth');
            } else {
              modes.push('native');
            }

            for (let i = 0; i < modes.length; i++) {
              if (_coinsFromStorage.hasOwnProperty(modes[i])) {
                for (let j = 0; j < _coinsFromStorage[modes[i]].length; j++) {
                  let _params = {};

                  if (_coinsFromStorage.params &&
                      _coinsFromStorage.params[_coinsFromStorage[modes[i]][j]]) {
                    if (_coinsFromStorage.params[_coinsFromStorage[modes[i]][j]].indexOf('-genproclimit') > -1) {
                      _params.daemonParam = 'gen';
                      _params.genProcLimit = _coinsFromStorage.params[_coinsFromStorage[modes[i]][j]][_coinsFromStorage.params[_coinsFromStorage[modes[i]][j]].indexOf('-genproclimit')].replace('-genproclimit=', '');
                    } else if (_coinsFromStorage.params[_coinsFromStorage[modes[i]][j]].indexOf('-regtest') > -1) {
                      _params.daemonParam = 'regtest';
                    } else if (_coinsFromStorage.params[_coinsFromStorage[modes[i]][j]].indexOf('-pubkey') > -1) {
                      _params.usePubkey = true;
                    }
                  }

                  this.coins[_coinsFromStorage[modes[i]][j]] = {
                    value: modes[i] === 'eth' ? `ETH|${_coinsFromStorage[modes[i]][j]}`: _coinsFromStorage[modes[i]][j],
                    mode: modes[i],
                    params: Object.keys(_params).length ? _params : null,
                  }
                }
              }
            }

            this.activateAllCoins();
          } else {
            setTimeout(() => {
              this.setState({
                activeLoginSection: 'activateCoin',
              });
            }, 100);
          }
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

  updateActiveLoginSection(name) {
    const newSeed = passphraseGenerator.generatePassPhrase(256);
    // reset login/create form
    this.setState({
      activeLoginSection: name,
      loginPassphrase: null,
      seedInputVisibility: false,
      bitsOption: 256,
      randomSeed: newSeed,
      randomSeedShuffled: shuffleArray(newSeed.split(' ')),
      randomSeedConfirm: [],
      isSeedConfirmError: false,
      isSeedBlank: false,
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
    } else if (
      this.state.activeLoginSection === 'signup' &&
      this.state.walletType === 'native' &&
      this.state.step === 0
    ) {
      this.setState({
        step: 3,
      });
    } else {
      this.setState({
        step: this.state.step + 1,
      });
    }
  }

  handleRegisterWallet() {
    const _seed = this.state.activeLoginSection === 'signup' ? this.state.randomSeed : this.state.loginPassphrase;
    const walletType = this.state.activeLoginSection === 'signup' ? this.state.walletType : 'default';
    let enteredSeedsMatch = this.state.activeLoginSection === 'signup' ? this.state.randomSeed === this.state.randomSeedConfirm.join(' ') : true;
    let isSeedBlank = this.state.activeLoginSection === 'signup' ? this.isBlank(this.state.randomSeed) : false;
    let stringEntropy = this.state.activeLoginSection === 'signup' ? mainWindow.checkStringEntropy(this.state.randomSeed) : true;

    if (walletType === 'native') { // skip lite mode checks
      enteredSeedsMatch = true;
      isSeedBlank = false;
      stringEntropy = true;
    }

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
                  walletType,
                  false,
                  this.state.customPinFilename,
                )
                .then((res) => {
                  if (res.msg === 'success') {
                    this.loadPinList();
                    Store.dispatch(activeHandle());

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
                this.state.encryptKey,
                'default'
              )
              .then((res) => {
                if (res.msg === 'success') {
                  this.loadPinList();
                  Store.dispatch(activeHandle());

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