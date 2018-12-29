import React from 'react';
import { connect } from 'react-redux';
import {
  getExchangesCache,
  toggleExchangesOrderInfoModal,
  apiElectrumBalancePromise,
  apiEthereumBalancePromise,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import ExchangesRender, {
  RenderExchangeHistory,
  RenderNewOrderForm,
} from './exchanges.render';
import { setTimeout } from 'timers';
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

      if (type === 'src') {
        let _coins = JSON.parse(JSON.stringify(this.props.Main.coins));
        _coins[_coin[1]].splice(_coins[_coin[1]].indexOf(_coin[0].toUpperCase()), 1);
        this.coinsDestList = _coins;
      } else {
        let _coins = JSON.parse(JSON.stringify(this.props.Main.coins));
        _coins[_coin[1]].splice(_coins[_coin[1]].indexOf(_coin[0].toUpperCase()), 1);
        this.coinsSrcList = _coins;
      }
    }
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
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