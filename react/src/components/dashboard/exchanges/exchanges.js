import React from 'react';
import { connect } from 'react-redux';
import {
  getExchangesCache,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import mainWindow from '../../../util/mainWindow';
import ExchangesRender, {
  RenderExchangeHistory,
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
    };
    this.exchangesCacheInterval = null;
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
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    Dashboard: state.Dashboard,
  };
};

export default connect(mapStateToProps)(Exchanges);