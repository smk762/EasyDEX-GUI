import React from 'react';
import {
  toggleAddcoinModal,
  iguanaWalletPassphrase,
  iguanaActiveHandle,
  startInterval,
  getDexCoins,
  toggleSyncOnlyModal,
  getSyncOnlyForks,
  createNewWallet,
  triggerToaster
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
      customWalletSeed: false
    };
    this.toggleActivateCoinForm = this.toggleActivateCoinForm.bind(this);
    this.updateInput = this.updateInput.bind(this);
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

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
      isSeedConfirmError: false,
      isSeedBlank: this.isBlank(e.target.value),
      loginPassPhraseSeedType: this.getLoginPassPhraseSeedType(e.target.value)
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
      seedInputVisibility: false,
      bitsOption: 256,
      randomSeed: PassPhraseGenerator.generatePassPhrase(256),
      randomSeedConfirm: '',
      isSeedConfirmError: false,
      isSeedBlank: false,
      displaySeedBackupModal: false,
      customWalletSeed: false
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

  handleRegisterWallet() {
    const enteredSeedsMatch = this.state.randomSeed === this.state.randomSeedConfirm;
    const isSeedBlank = this.isBlank(this.state.randomSeed);

    if (enteredSeedsMatch && !isSeedBlank) {
      this.toggleSeedBackupModal();
    } else if (!enteredSeedsMatch) {
      this.setState({
        isSeedConfirmError: true,
      });
    } else if (isSeedBlank) {
      this.setState({
        isSeedBlank: true
      });
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
