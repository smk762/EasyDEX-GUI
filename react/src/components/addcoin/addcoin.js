import React from 'react';
import { connect } from 'react-redux';
import translate from '../../translate/translate';
import Config from '../../config';
import {
  addCoin,
  addCoinEth,
  toggleAddcoinModal,
  triggerToaster,
  apiGetCoinList,
  apiPostCoinList,
  toggleZcparamsFetchModal,
} from '../../actions/actionCreators';
import Store from '../../store';
import zcashParamsCheckErrors from '../../util/zcashParams';
import mainWindow, { staticVar } from '../../util/mainWindow';
import { pubkeyToAddress } from 'agama-wallet-lib/src/keys';
import bitcoinjsNetworks from 'agama-wallet-lib/src/bitcoinjs-networks';

import AddCoinRender from './addcoin.render';
import addCoinOptionsCrypto from '../addcoin/addcoinOptionsCrypto';
import addCoinOptionsAC from '../addcoin/addcoinOptionsAC';

const modeToValue = {
  spv: 0,
  native: -1,
  eth: 3,
};

const modeToValueReversed = {
  '0': 'spv',
  '-1': 'native',
  '3': 'eth',
};

class AddCoin extends React.Component {
  constructor() {
    super();
    this.state = {
      coins: {},
      display: false,
      actionsMenu: false,
      className: 'hide',
      isExperimentalOn: false,
      usePubkey: false,
      type: 'spv',
      quickSearch: null,
      coinsList: null,
    };
    this.defaultState = JSON.parse(JSON.stringify(this.state));
    this.dismiss = this.dismiss.bind(this);
    this.activateAllCoins = this.activateAllCoins.bind(this);
    this.toggleActionsMenu = this.toggleActionsMenu.bind(this);
    this.saveCoinSelection = this.saveCoinSelection.bind(this);
    this.loadCoinSelection = this.loadCoinSelection.bind(this);
    this.verifyZcashParamsExist = this.verifyZcashParamsExist.bind(this);
    this.toggleUsePubkey = this.toggleUsePubkey.bind(this);
    this.updateModeType = this.updateModeType.bind(this);
    this.filterCoins = this.filterCoins.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateCoinSelection = this.updateCoinSelection.bind(this);
    this.isNativeCoinsSelected = this.isNativeCoinsSelected.bind(this);
    this.isLiteCoinsSelected = this.isLiteCoinsSelected.bind(this);
  }

  isNativeCoinsSelected() {
    if (this.state.coins) {
      for (let key in this.state.coins) {
        if (this.state.coins[key].mode === 'native') {
          return true;
        }
      }
    }
  }

  isLiteCoinsSelected() {
    if (this.state.coins) {
      for (let key in this.state.coins) {
        if (this.state.coins[key].mode === 'spv' ||
            this.state.coins[key].mode === 'eth') {
          return true;
        }
      }
    }
  }

  updateCoinSelection(coin, params) {
    let coins = JSON.parse(JSON.stringify(this.state.coins));

    if (coins[coin.value] && 
        !params) {
      delete coins[coin.value];
    } else {
      coins[coin.value] = {
        coin,
        params,
        mode: this.state.type,
      };
    }

    this.setState({
      coins,
    });
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });

    setTimeout(() => {
      this.setState({
        coinsList: this.filterCoins(),
      });
    }, 10);
  }

  filterCoins() {
    const coins = addCoinOptionsCrypto('skip').concat(addCoinOptionsAC('skip'));
    let items = [];

    for (let i = 0; i < coins.length; i++) {
      if ((coins[i].value.indexOf(this.state.type === 'eth' ? `ETH|` : `|${this.state.type}`) > -1 || (this.state.type === 'eth' && coins[i].value === 'ETH')) &&
          (!this.state.quickSearch || (this.state.quickSearch && (coins[i].label.substring(0, this.state.quickSearch.length).toLowerCase() === this.state.quickSearch.toLowerCase() || (this.state.type === 'eth' ? (coins[i].value.split('|')[1] || coins[i].value.split('|')[0]).substring(0, this.state.quickSearch.length).toLowerCase() : coins[i].value.split('|')[0].substring(0, this.state.quickSearch.length).toLowerCase()) === this.state.quickSearch.toLowerCase())))) {
        items.push(coins[i]);
      }
    }

    return items;
  }

  updateModeType(type) {
    this.setState({
      type,
    });

    setTimeout(() => {
      this.setState({
        coinsList: this.filterCoins(),
      });
    }, 10);
  }

  toggleUsePubkey() {
    this.setState({
      usePubkey: !this.state.usePubkey,
    });
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

  saveCoinSelection() {
    apiPostCoinList(this.state.coins)
    .then((json) => {
      this.toggleActionsMenu();
    });
  }

  loadCoinSelection() {
    apiGetCoinList()
    .then((json) => {
      if (json.msg !== 'error') {
        let coins = {};

        if (json.result[0] &&
            json.result[0].hasOwnProperty('selectedCoin')) { // convert old version to new version
          for (let i = 0; i < json.result.length; i++) {
            let params = {};

            if (Number(json.result[i].mode) === -1 &&
                json.result[i].daemonParam) {
              params.daemonParam = json.result[i].daemonParam;
            }

            if (Number(json.result[i].mode) === -1 &&
                json.result[i].genProcLimit) {
              params.genProcLimit = json.result[i].genProcLimit;
            }            

            coins[json.result[i].selectedCoin] = {
              coin: {
                value: json.result[i].selectedCoin,
              },
              params: Object.keys(params).length ? params : null,
              mode: modeToValueReversed[json.result[i].mode],
            };
          }
        } else {
          coins = json.result;
        }

        this.setState(Object.assign({}, this.state, {
          coins,
          actionsMenu: false,
        }));
      } else {
        Store.dispatch(
          triggerToaster(
            translate('TOASTR.SELECTION_NOT_FOUND'),
            translate('TOASTR.COIN_SELECTION'),
            'info'
          )
        );
      }
    });
  }

  toggleActionsMenu() {
    this.setState(Object.assign({}, this.state, {
      actionsMenu: !this.state.actionsMenu,
    }));
  }

  componentWillMount() {
    this.setState({
      isExperimentalOn: mainWindow.appConfig.userAgreement,
      coinsList: this.filterCoins(),
    });
  }

  componentWillReceiveProps(props) {
    const addCoinProps = props ? props.AddCoin : null;

    this.existingCoins = props && props.Main ? props.Main.coins : null;

    if (addCoinProps &&
        addCoinProps.display !== this.state.display) {
      this.setState(Object.assign({}, this.state, {
        className: addCoinProps.display ? 'show fade' : 'show out',
        type: this.props.Main.coins.native.length || !this.props.Main.isLoggedIn ? 'native' : 'spv',
      }));

      setTimeout(() => {
        this.setState(Object.assign({}, this.state, {
          display: addCoinProps.display,
          className: addCoinProps.display ? 'show in' : 'hide',
        }));

        if (!addCoinProps.display) {
          setTimeout(() => {
            this.setState({
              coins: {},
              quickSearch: null,
            });
          }, 100);
        } else {
          setTimeout(() => {
            this.setState({
              coinsList: this.filterCoins(),
            });
          }, 10);
        }
      }, addCoinProps.display ? 50 : 300);
    }
  }

  updateGenproclimitParam(e, index) {
    let _coins = this.state.coins;

    _coins[index].genProcLimit = e.target.value;

    this.setState(Object.assign({}, this.state, {
      coins: _coins,
    }));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.dismiss();
    }
  }

  dismiss() {
    this.setState(this.defaultState);
    Store.dispatch(toggleAddcoinModal(false, false));
  }

  activateAllCoins() {
    const _activateAllCoins = () => {
      let _coin = this.state.coins[Object.keys(this.state.coins)[0]];
      let coin = this.state.coins[Object.keys(this.state.coins)[0]].coin.value.split('|')[0];
      let coinuc = coin.toUpperCase();
      let _i = 0;
      
      for (let key in this.state.coins) {
        _i++;
        let _coin = this.state.coins[key];
        let coin = _coin.coin.value.split('|')[0];
        let coinuc = coin.toUpperCase();
  
        setTimeout(() => {
          if (!_coin.params) {
            if (_coin.coin.value.indexOf('ETH') > -1) {
              const _ethNet = _coin.coin.value.split('|');
  
              Store.dispatch(addCoinEth(
                _ethNet[0],
                _ethNet[1],
              ));
            } else {
              Store.dispatch(addCoin(
                coin,
                modeToValue[_coin.mode],
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
              _coin.params.usePubkey && pubkeyToAddress(Config.pubkey, bitcoinjsNetworks.kmd) ? Config.pubkey : null,
            ));
          }
  
          if (_i === Object.keys(this.state.coins).length - 1) {
            let _coins = [];
            _coins.push(this.state.defaultCoinState);
  
            this.setState(Object.assign({}, this.state, {
              coins: _coins,
            }));
  
            Store.dispatch(toggleAddcoinModal(false, false));
  
            setTimeout(() => {
              this.setState({
                loginPassphrase: '',
                seedInputVisibility: false,
                seedExtraSpaces: false,
                trimPassphraseTimer: null,
              });
            }, 100);
          }
        }, (_coin.mode === 'native' ? 2000 : 0) * (_i - 1));
      }
    };

    let isNativeModeCoin;

    for (let key in this.state.coins) {
      if (this.state.coins[key].mode === 'native') {
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

  render() {
    return (
      AddCoinRender.call(this)
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
    },
    AddCoin: state.AddCoin,
  };
};

export default connect(mapStateToProps)(AddCoin);