import React from 'react';
import {
  toggleAddcoinModal,
  iguanaWalletPassphrase,
  iguanaActiveHandle,
  startInterval,
  getDexCoins,
  toggleSyncOnlyModal,
  getSyncOnlyForks,
  createNewWallet
} from '../../actions/actionCreators';
import Store from '../../store';
import {PassPhraseGenerator} from '../../util/crypto/passphrasegenerator';
import SwallModalRender from './swall-modal.render';
import LoginRender from './login.render';
import {translate} from '../../translate/translate';

const IGUNA_ACTIVE_HANDLE_TIMEOUT = 3000;
const IGUNA_ACTIVE_COINS_TIMEOUT = 10000;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      activeLoginSection: 'activateCoin',
      loginPassphrase: null,
      seedInputVisibility: false,
      loginPassPhraseSeedType: null,
      bitsOption: 256,
      randomSeed: PassPhraseGenerator.generatePassPhrase(256),
      randomSeedConfirm: '',
      isSeedConfirmError: false,
      isSeedBlank: false,
      displaySeedBackupModal: false,
      customWalletSeed: false,
      isCustomSeedWeak: false,
    };
    this.toggleActivateCoinForm = this.toggleActivateCoinForm.bind(this);
    this.updateRegisterConfirmPassPhraseInput = this.updateRegisterConfirmPassPhraseInput.bind(this);
    this.updateLoginPassPhraseInput = this.updateLoginPassPhraseInput.bind(this);
    this.loginSeed = this.loginSeed.bind(this);
    this.toggleSeedInputVisibility = this.toggleSeedInputVisibility.bind(this);
    this.handleRegisterWallet = this.handleRegisterWallet.bind(this);
    this.openSyncOnlyModal = this.openSyncOnlyModal.bind(this);
    this.toggleSeedBackupModal = this.toggleSeedBackupModal.bind(this);
    this.execWalletCreate = this.execWalletCreate.bind(this);
  }

  isCustomWalletSeed() {
    return this.state.customWalletSeed;
  }

  toggleCustomWalletSeed() {
    this.setState({
      customWalletSeed: !this.state.customWalletSeed
    }, () => {
      // if customWalletSeed is set to false, regenerate the seed
      if (!this.state.customWalletSeed) {
        this.setState({
          randomSeed: PassPhraseGenerator.generatePassPhrase(this.state.bitsOption),
          isSeedConfirmError: false,
          isSeedBlank: false
        });
      } else {
        // if customWalletSeed is set to true, reset to seed to an empty string
        this.setState({
          randomSeed: '',
          randomSeedConfirm: ''
        });
      }
    });
  }

  openSyncOnlyModal() {
    Store.dispatch(getSyncOnlyForks());

    const _iguanaActiveHandle = setInterval(() => {
      Store.dispatch(getSyncOnlyForks());
    }, IGUNA_ACTIVE_HANDLE_TIMEOUT);
    Store.dispatch(
      startInterval(
        'syncOnly',
        _iguanaActiveHandle
      )
    );

    Store.dispatch(toggleSyncOnlyModal(true));
  }

  componentDidMount() {
    Store.dispatch(iguanaActiveHandle(true));
  }

  toggleSeedInputVisibility() {
    this.setState({
      seedInputVisibility: !this.state.seedInputVisibility,
    });
  }

  generateNewSeed(bits) {
    this.setState(Object.assign({}, this.state, {
      randomSeed: PassPhraseGenerator.generatePassPhrase(bits),
      bitsOption: bits,
      isSeedBlank: false
    }));
  }

  componentWillReceiveProps(props) {
    if (props &&
      props.Main &&
      props.Main.isLoggedIn) {
      this.setState({
        display: false,
      });
    }

    if (props &&
      props.Main &&
      !props.Main.isLoggedIn) {
      this.setState({
        display: true,
      });

      if (!this.props.Interval.interval.activeCoins) {
        const _iguanaActiveCoins = setInterval(() => {
          Store.dispatch(getDexCoins());
        }, IGUNA_ACTIVE_COINS_TIMEOUT);
        Store.dispatch(startInterval('activeCoins', _iguanaActiveCoins));
      }

      document.body.className = 'page-login layout-full page-dark';
    }

    if (this.state.activeLoginSection !== 'signup') {
      if (props &&
        props.Main &&
        props.Main.activeCoins) {
        this.setState({
          activeLoginSection: 'login',
        });
      } else {
        this.setState({
          activeLoginSection: 'activateCoin',
        });
      }
    }
  }

  toggleActivateCoinForm() {
    Store.dispatch(toggleAddcoinModal(true, false));
  }

  updateLoginPassPhraseInput(e) {
    // remove any empty chars from the start/end of the string
    const newValue = e.target.value ? e.target.value.trim() : null;

    this.setState({
      [e.target.name]: newValue,
      loginPassPhraseSeedType: this.getLoginPassPhraseSeedType(newValue)
  });
  }

  updateRegisterConfirmPassPhraseInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
      isSeedConfirmError: false,
      isSeedBlank: this.isBlank(e.target.value)
    });
  }

  updateWalletSeed(e) {
    this.setState({
      randomSeed: e.target.value,
      isSeedConfirmError: false,
      isSeedBlank: this.isBlank(e.target.value)
    });
  }

  loginSeed() {
    // reset the login pass phrase values so that when the user logs out, the values are clear
    this.setState({
      loginPassphrase: null,
      loginPassPhraseSeedType: null,
    });

    Store.dispatch(
      iguanaWalletPassphrase(this.state.loginPassphrase)
    );
  }

  getLoginPassPhraseSeedType(passPhrase) {
    if (!passPhrase) {
      return null;
    }

    const passPhraseWords = passPhrase.split(" ");
    if (!PassPhraseGenerator.arePassPhraseWordsValid(passPhraseWords))
      return null;

    if (PassPhraseGenerator.isPassPhraseValid(passPhraseWords, 256)) {
      return translate('LOGIN.IGUANA_SEED');
    }

    if (PassPhraseGenerator.isPassPhraseValid(passPhraseWords, 160)) {
      return translate('LOGIN.WAVES_SEED');
    }

    if (PassPhraseGenerator.isPassPhraseValid(passPhraseWords, 128)) {
      return translate('LOGIN.NXT_SEED');
    }

    return null;
  }

  updateActiveLoginSection(name) {
    // reset login/create form
    this.setState({
      activeLoginSection: name,
      loginPassphrase: null,
      loginPassPhraseSeedType: null,
      seedInputVisibility: false,
      bitsOption: 256,
      randomSeed: PassPhraseGenerator.generatePassPhrase(256),
      randomSeedConfirm: '',
      isSeedConfirmError: false,
      isSeedBlank: false,
      displaySeedBackupModal: false,
      customWalletSeed: false,
      isCustomSeedWeak: false,
   });
  }

  execWalletCreate() {
    Store.dispatch(
      createNewWallet(
        this.state.randomSeedConfirm,
        this.props.Dashboard.activeHandle
      )
    );

    this.setState({
      activeLoginSection: 'activateCoin',
      displaySeedBackupModal: false,
      isSeedConfirmError: false,
    });
  }

  // TODO: 
  //    1) disable register btn if seed or seed conf is incorrect
  //    2) display explicit custom seed validation message
  handleRegisterWallet() {
    const enteredSeedsMatch = this.state.randomSeed === this.state.randomSeedConfirm;
    const isSeedBlank = this.isBlank(this.state.randomSeed);

    // if custom seed check for string strength
    // at least 1 letter in upper case
    // at least 1 digit
    // at least one special char
    // min length 10 chars

    const _customSeed = this.state.customWalletSeed ? this.state.randomSeed.match('^(?=.*[A-Z])(?=.*[^<>{}\"/|;:.,~!?@#$%^=&*\\]\\\\()\\[_+]*$)(?=.*[0-9])(?=.*[a-z]).{10,99}$') : false;

    this.setState({
      isCustomSeedWeak: _customSeed === null ? true : false,
      isSeedConfirmError: !enteredSeedsMatch ? true : false,
      isSeedBlank: isSeedBlank ? true : false,
    });
    
    if (enteredSeedsMatch && !isSeedBlank && _customSeed !== null) {
      this.toggleSeedBackupModal();
    }
  }

  isBlank(str) {
    return (!str || /^\s*$/.test(str));
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      this.loginSeed();
    }
  }

  toggleSeedBackupModal() {
    this.setState(Object.assign({}, this.state, {
      displaySeedBackupModal: !this.state.displaySeedBackupModal,
    }));
  }

  renderSwallModal() {
    if (this.state.displaySeedBackupModal) {
      return SwallModalRender.call(this);
    }

    return null;
  }

  render() {
    if ((this.state && this.state.display) || !this.props.Main) {
      return LoginRender.call(this);
    }

    return null;
  }
}

export default Login;
