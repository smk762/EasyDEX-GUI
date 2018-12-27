import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';
import {
  formatValue,
} from 'agama-wallet-lib/src/utils';
import { secondsToString } from 'agama-wallet-lib/src/time';
import ExchangesOrderInfoModal from '../exchangesOrderInfoModal/exchangesOrderInfoModal';

export const RenderExchangeHistory = function() {
  const _cache = this.props.Dashboard.exchanges && this.props.Dashboard.exchanges[this.state.provider];
  let _items = [];

  for (let key in _cache) {
    if (this.state.provider === 'coinswitch') {
      _items.push(
        <tr key={ `${this.state.provider}-${key}` }>
          <td>
            { secondsToString(_cache[key].createdAt / 1000) }
          </td>
          <td>
            <img
              className="margin-right-10"
              height="25px"
              src={ `assets/images/cryptologo/${_cache[key].depositCoin}.png` } />
            { formatValue(_cache[key].expectedDepositCoinAmount) } { _cache[key].depositCoin.toUpperCase() }
          </td>
          <td>
            <img
              className="margin-right-10"
              height="25px"
              src={ `assets/images/cryptologo/${_cache[key].destinationCoin}.png` } />
            { formatValue(_cache[key].expectedDestinationCoinAmount) } { _cache[key].destinationCoin.toUpperCase() }
          </td>
          <td>
            { _cache[key].status }
          </td>
          <td></td>
          <td>
          <button
            type="button"
            className="btn btn-xs white btn-info waves-effect waves-light btn-kmdtxid"
            onClick={ () => this._toggleExchangesOrderInfoModal(key) }>
            <i className="icon fa-search"></i>
          </button>
          </td>
        </tr>
      );
    }
  }

  return (
    <div className="table-scroll">
      <table className="table table-hover dataTable table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Deposit</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
        { _items }
        </tbody>
        <tfoot>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Deposit</th>
            <th>Details</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const ExchangesRender = function() {
  return (
    <section className="exchanges-main">
      <div className="page margin-left-0">
        <div className="page-content tools background--white">
          <div className="row">
            <div className="col-sm-12 no-padding-left padding-top-10">
              <div className="margin-top-20 exchanges-selector-main text-center">
                <img
                  onClick={ () => this.toggleExchangeProvider('coinswitch') }
                  className={ `pointer${this.state.provider === 'coinswitch' ? ' active' : ''}` }
                  height="30px"
                  src="assets/images/exchanges/coinswitch.png" />
                <img
                  onClick={ () => this.toggleExchangeProvider('changelly') }
                  className={ `pointer${this.state.provider === 'changelly' ? ' active' : ''} margin-left-70` }
                  height="50px"
                  src="assets/images/exchanges/changelly.png" />
              </div>
              <div className="margin-top-40 exchanges-history">
                <h4>My exchange history</h4>
                <div>
                { this._RenderExchangeHistory() }
                </div>
              </div>
              <ExchangesOrderInfoModal provider={ this.state.provider } />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExchangesRender;