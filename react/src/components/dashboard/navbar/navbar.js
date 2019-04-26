import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardChangeSection,
  toggleAddcoinModal,
  stopInterval,
  startInterval,
  displayImportKeyModal,
  apiElectrumLock,
  apiLogout,
  clearActiveCoinStore,
  getDexCoins,
  activeHandle,
  dashboardRemoveCoin,
  dashboardChangeActiveCoin,
  toggleNotaryElectionsModal,
  toggleBlurSensitiveData,
  // coind stop
  apiStopCoind,
  triggerToaster,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import { checkAC } from '../../addcoin/payload';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import NavbarRender from './navbar.render';
import translate from '../../../translate/translate';

const { shell } = window.require('electron');
const COIND_STOP_MAX_RETRIES = 15;

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      openDropMenu: false,
      isExperimentalOn: false,
      coindStopRetries: 0,
    };
    this.nativeCoinsDelete = {};
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this._toggleNotaryElectionsModal = this._toggleNotaryElectionsModal.bind(this);
    this._checkAC = this._checkAC.bind(this);
    this._toggleBlurSensitiveData = this._toggleBlurSensitiveData.bind(this);
    this.logout = this.logout.bind(this);
    this.stopCoind = this.stopCoind.bind(this);
    this.stopAllCoind = this.stopAllCoind.bind(this);
    this.openKomodoPlatformLink = this.openKomodoPlatformLink.bind(this);
  }

  stopCoind(coin, i, _coins) {
    this.setState({
      openDropMenu: false,
      coindStopRetries: {
        [coin]: this.state.coindStopRetries[coin] ? this.state.coindStopRetries[coin] : 0,
      },
    });

    apiStopCoind(coin)
    .then((res) => {
      if (res.msg === 'error') {
        if (!this.state.coindStopRetries[coin]) {
          Store.dispatch(
            triggerToaster(
              translate('TOASTR.COIND_STOP_IN_PROGRESS', coin),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'warning'
            )
          );
        }
        
        if (this.state.coindStopRetries[coin] < COIND_STOP_MAX_RETRIES &&
            this.props.Main.coins.native.indexOf(coin) > -1) {
          setTimeout(() => {
            this.setState({
              coindStopRetries: {
                [coin]: Number(this.state.coindStopRetries) + 1,
              },
            });
            setTimeout(() => {
              this.stopCoind(coin, i, this.props.Main.coins.native);
            }, 10);
          }, 1500);
        } else {
          Store.dispatch(
            triggerToaster(
              translate('TOASTR.COIN_UNABLE_TO_STOP', coin),
              translate('TOASTR.ERROR'),
              'error'
            )
          );
        }
      } else {
        delete this.nativeCoinsDelete[coin];

        if (!Object.keys(this.nativeCoinsDelete).length) {
          apiLogout()
          .then((res) => {
            Store.dispatch(getDexCoins());
            Store.dispatch(activeHandle());
            Store.dispatch(clearActiveCoinStore());
          });
        }

        Store.dispatch(getDexCoins());
        Store.dispatch(activeHandle());

        Store.dispatch(
          triggerToaster(
            `${coin} ${translate('TOASTR.COIN_IS_STOPPED')}`,
            translate('TOASTR.COIN_NOTIFICATION'),
            'success'
          )
        );

        this.setState({
          coindStopRetries: {
            [coin]: 0,
          },
        });

        if (Object.keys(this.nativeCoinsDelete).length) {
          setTimeout(() => {
            if (document.getElementById('coin-tile-1')) {
              document.getElementById('coin-tile-1').click();
            }
          }, 100);
        }
      }
    });
  }

  stopAllCoind() {
    const _coins = this.props.Main.coins.native;
    this.nativeCoinsDelete = _coins;

    this.setState({
      toggledCoinMenu: null,
    });

    for (let i = 0; i < _coins.length; i++) {
      const coin = _coins[i];

      setTimeout(() => {
        this.stopCoind(coin, i, _coins);
      }, i === 0 ? 0 : i * 2000);
    }
  }

  openKomodoPlatformLink() {
    return shell.openExternal('https://komodoplatform.com/komodo-wallets');
  }

  _toggleBlurSensitiveData() {
    Store.dispatch(toggleBlurSensitiveData(!this.props.Main.blurSensitiveData));
  }

  isRenderLogout() {
    const _main = this.props.Main;

    if (_main &&
        _main.isLoggedIn &&
        _main.isPin) {
      return true;
    }
  }

  logout() {
    Store.dispatch(
      stopInterval(
        'prices',
        this.props.Interval.interval
      )
    );

    if (this.props.Main.coins.native &&
        this.props.Main.coins.native.length) {
      this.stopAllCoind();
    } else {
      apiLogout()
      .then((res) => {
        const _coins = this.props.Main.coins;
        const _spvCoins = _coins.spv;
        const _ethCoins = _coins.eth;

        mainWindow.pinAccess = false;

        if (!_coins.native.length) {
          Store.dispatch(dashboardChangeActiveCoin(null, null, true));
        }

        setTimeout(() => {
          for (let i = 0; i < _spvCoins.length; i++) {
            Store.dispatch(dashboardRemoveCoin(_spvCoins[i]));
          }
          for (let i = 0; i < _ethCoins.length; i++) {
            Store.dispatch(dashboardRemoveCoin(_ethCoins[i]));
          }
          if (!_coins.native.length) {
            Store.dispatch(dashboardChangeActiveCoin(null, null, true));
          }

          Store.dispatch(getDexCoins());
          Store.dispatch(activeHandle());
          Store.dispatch(clearActiveCoinStore());

          if (_coins.native.length) {
            Store.dispatch(dashboardChangeActiveCoin(_coins.native[0], 'native'));    
          }
        }, 500);

        Store.dispatch(getDexCoins());
        Store.dispatch(activeHandle());
      });
    }
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    this.setState({
      isExperimentalOn: mainWindow.appConfig.userAgreement,
    });

    if (staticVar.argv.indexOf('dexonly') > -1) {
      Store.dispatch(dashboardChangeSection(mainWindow.activeSection));
    }
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  handleClickOutside(e) {
    const _srcElement = e ? e.srcElement : null;

    if (e &&
        _srcElement &&
        _srcElement.className !== 'dropdown-menu' &&
        _srcElement.className !== 'icon fa-bars' &&
        _srcElement.title !== 'top menu' &&
        (_srcElement.offsetParent && _srcElement.offsetParent.className !== 'navbar-avatar-inner') &&
        _srcElement.className.indexOf('navbar-avatar') === -1 &&
        (e.path && e.path[4] && e.path[4].className.indexOf('dropdown-menu') === -1)) {
      this.setState({
        openDropMenu: false,
      });
    }
  }

  openImportKeyModal() {
    Store.dispatch(displayImportKeyModal(true));
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      openDropMenu: !this.state.openDropMenu,
    }));
  }

  _toggleNotaryElectionsModal() {
    Store.dispatch(toggleNotaryElectionsModal(true));
  }

  toggleAddCoinModal() {
    Store.dispatch(toggleAddcoinModal(true, false));
  }

  dashboardChangeSection(sectionName) {
    mainWindow.activeSection = sectionName;
    Store.dispatch(dashboardChangeSection(sectionName));
  }

  _checkAC() {
    return checkAC(this.props.ActiveCoin.coin);
  }

  isSectionActive(section) {
    return this.props.Dashboard.activeSection === section;
  }

  render() {
    return NavbarRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      mode: state.ActiveCoin.mode,
      coin: state.ActiveCoin.coin,
    },
    Dashboard: {
      activeSection: state.Dashboard.activeSection,
    },
    Interval: {
      interval: state.Interval.interval,
    },
    Main: {
      isLoggedIn: state.Main.isLoggedIn,
      coins: state.Main.coins,
      blurSensitiveData: state.Main.blurSensitiveData,
      newUpdateAvailable: state.Main.newUpdateAvailable,
    },
  };
};

export default connect(mapStateToProps)(Navbar);