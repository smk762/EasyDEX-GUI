import React from 'react';
import { connect } from 'react-redux';
import {
  getExchangesCache,
  toggleExchangesOrderInfoModal,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import ExchangesRender, {
  RenderExchangeHistory,
  RenderNewOrderForm,
} from './exchanges.render';
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
    this.defailtExchangeOrderState = JSON.parse(JSON.stringify(this.state.newExchangeOrderDetails));
    this.exchangesCacheInterval = null;
    this._toggleExchangesOrderInfoModal = this._toggleExchangesOrderInfoModal.bind(this);
    this.toggleCreateOrder = this.toggleCreateOrder.bind(this);
  }

  getActiveCoins() {
    const _activeCoins = this.props.Main.coins.spv;
    let _items = [];

    if (_activeCoins &&
        _activeCoins.length) {
      for (let i = 0; _activeCoins.length; i++) {

      }
    }

    return _items;
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