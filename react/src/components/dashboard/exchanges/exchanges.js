import React from 'react';
import { connect } from 'react-redux';
import {
  getExchangesCache,
  exchangesGetRate,
  toggleExchangesOrderInfoModal,
  apiElectrumBalancePromise,
  apiEthereumBalancePromise,

  pricesPromise,
  apiGetRemoteBTCFees,
  apiGetLocalBTCFees,
  apiElectrumSendPreflight,
  apiEthereumGasPrice,
  apiEthereumSend,
  apiEthereumSendERC20Preflight,  
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import ExchangesRender, {
  RenderExchangeHistory,
  RenderNewOrderForm,
} from './exchanges.render';
import {
  explorerList,
  isKomodoCoin,
} from 'agama-wallet-lib/src/coin-helpers';
import {
  isPositiveNumber,
  fromSats,
  toSats,
  parseBitcoinURL,
} from 'agama-wallet-lib/src/utils';
import { formatEther } from 'ethers/utils/units';
import { getAddress } from 'ethers/utils/address';
import coinFees from 'agama-wallet-lib/src/fees';
import erc20ContractId from 'agama-wallet-lib/src/eth-erc20-contract-id';

const { shell } = window.require('electron');
const EXCHANGES_CACHE_UPDATE_INTERVAL = 60; // sec
const providers = [
  'coinswitch',
  'changelly',
];

class Exchanges extends React.Component {
  constructor() {
    super();
    this.state = {
      provider: providers[0],
      newExchangeOrder: false,
      processing: false,
      newExchangeOrderDetails: {
        currentBalance: 'none',
        step: 0,
        orderStep: 0,
        depositStep: 0,
        orderId: null,
        amount: 0,
        coinSrc: null,
        coinDest: null,
        rate: null,
        minAmount: null,
        exchangeRate: null,
        fiatPrices: null,
        exchangeOrder: null,
      },
    };
    this.coinsSrcList = null;
    this.coinsDestList = null;
    this.defaultExchangeOrderState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
    this.exchangesCacheInterval = null;
    this._toggleExchangesOrderInfoModal = this._toggleExchangesOrderInfoModal.bind(this);
    this.toggleCreateOrder = this.toggleCreateOrder.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateSelectedCoin = this.updateSelectedCoin.bind(this);
    this.clearOrder = this.clearOrder.bind(this);
    this.setSendAmountAll = this.setSendAmountAll.bind(this);
    this.orderVerifyStep = this.orderVerifyStep.bind(this);
    this.loadTestData = this.loadTestData.bind(this);
  }

  loadTestData() {
    let _newState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
    _newState.coinSrc = 'KMD|spv';
    _newState.coinDest = 'GAME|spv';
    _newState.amount = 10;

    this.setState({
      newExchangeOrderDetails: _newState,
    });
  }

  orderVerifyStep() {
    // TODO: move to backend
    console.warn('state', this.state);

    const srcCoinSym = this.state.newExchangeOrderDetails.coinSrc.split('|')[0].toLowerCase();
    const destCoinSym = this.state.newExchangeOrderDetails.coinDest.split('|')[0].toLowerCase();

    if (this.state.newExchangeOrderDetails.orderStep === 0) {
      this.setState({
        processing: true,
      });

      exchangesGetRate(
        this.state.provider,
        srcCoinSym,
        destCoinSym
      )
      .then((exchangeRate) => {
        console.warn('rate', exchangeRate);

        if (this.state.provider === 'coinswitch') {
          if (exchangeRate.msg === 'success' &&
              exchangeRate.result.data) {
            let _newState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
            _newState.exchangeRate = exchangeRate.result.data;

            this.setState({
              newExchangeOrderDetails: _newState,
            });

            pricesPromise(
              [srcCoinSym, destCoinSym],
              Config.defaultFiatCurrency
            )
            .then((prices) => {
              let _newState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
              _newState.prices = prices;
              _newState.orderStep = 1;

              this.setState({
                processing: false,
                newExchangeOrderDetails: _newState,
              });

              console.warn('prices', prices);
            });
          }
        }
      });
    }
  }

  setSendAmountAll() {
    let _newState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
    _newState.amount = this.state.newExchangeOrderDetails.currentBalance;

    this.setState({
      newExchangeOrderDetails: _newState,
    });
  }

  clearOrder() {
    this.setState({
      newExchangeOrderDetails: this.defaultExchangeOrderState,
    });
    this.coinsSrcList = null;
    this.coinsDestList = null;
  }

  updateSelectedCoin(e, type) {
    if (e &&
        e.value) {
      const _coin = e.value.split('|');
      let _newState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
      _newState[type === 'src' ? 'coinSrc' : 'coinDest'] = e.value;

      if (type === 'src') {
        _newState.amount = '';
        _newState.currentBalance = '...';

        if (_coin[1] === 'spv') {
          apiElectrumBalancePromise(
            _coin[0],
            this.props.Dashboard.electrumCoins[_coin[0]].pub
          )
          .then((res) => {
            let _newState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
            _newState.currentBalance = res.msg === 'success' ? res.result.balance : 'none';

            this.setState({
              newExchangeOrderDetails: _newState,
            });
          });
        } else if (_coin[1] === 'eth') {
          apiEthereumBalancePromise(
            _coin[0],
            this.props.Dashboard.ethereumCoins[_coin[0]].pub
          )
          .then((res) => {
            let _newState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
            _newState.currentBalance = res.msg === 'success' ? res.result.balance : 'none';

            this.setState({
              newExchangeOrderDetails: _newState,
            });
          });
        }
      }
  
      this.setState({
        newExchangeOrderDetails: _newState,
      });

      let _coins = JSON.parse(JSON.stringify(this.props.Main.coins));
      _coins[_coin[1]].splice(_coins[_coin[1]].indexOf(_coin[0].toUpperCase()), 1);
  
      if (type === 'src') {
        this.coinsDestList = _coins;
      } else {
        this.coinsSrcList = _coins;
      }
    }
  }

  updateInput(e) {
    let _newState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
    _newState[e.target.name.split('-')[1]] = e.target.value;

    console.warn(_newState);

    this.setState({
      newExchangeOrderDetails: _newState,
    });
  }

  toggleCreateOrder() {
    this.setState({
      newExchangeOrder: !this.state.newExchangeOrder,
    });
  }

  _toggleExchangesOrderInfoModal(orderId) {
    Store.dispatch(toggleExchangesOrderInfoModal(orderId));
  }

  toggleExchangeProvider(provider) {
    this.setState({
      provider,
    });
    Store.dispatch(getExchangesCache(provider));
  }

  componentWillMount() {
    Store.dispatch(getExchangesCache(this.state.provider));

    this.exchangesCacheInterval = setInterval(() => {
      Store.dispatch(getExchangesCache(this.state.provider));
    }, EXCHANGES_CACHE_UPDATE_INTERVAL * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.exchangesCacheInterval);
  }

  renderCoinOption(option) {
    return (
      <div>
        <img
          src={ `assets/images/cryptologo/${option.icon.toLowerCase()}.png` }
          alt={ option.label }
          width="30px"
          height="30px" />
          <span className="margin-left-10">{ option.label }</span>
      </div>
    );
  }

  render() {
    return ExchangesRender.call(this);
  }

  _RenderExchangeHistory() {
    return RenderExchangeHistory.call(this);
  }

  _RenderNewOrderForm() {
    return RenderNewOrderForm.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    Dashboard: state.Dashboard,
  };
};

export default connect(mapStateToProps)(Exchanges);