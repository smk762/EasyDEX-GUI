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
import Select from 'react-select';
import addCoinOptionsCrypto from '../../addcoin/addcoinOptionsCrypto';

export const RenderNewOrderForm = function() {  
  return (
    <section className="exchanges-new-order-form">
      { this.state.newExchangeOrderDetails.step === 0 &&
        this.props.Main.coins &&
        this.props.Main.coins.spv.length > 1 &&
        <div className="step1">
          <h3 className="padding-left-15">Order details</h3>
          <div className="col-sm-12 padding-top-10 coin-send-form">
            <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="steps row margin-top-10">
                <div className="step col-md-4 current">
                  <span className="step-number">1</span>
                  <div className="step-desc">
                    <span className="step-title">Fill Order Form</span>
                    <p>Fill exchange order details</p>
                  </div>
                </div>
                <div className="step col-md-4">
                  <span className="step-number">2</span>
                  <div className="step-desc">
                    <span className="step-title">Confirming</span>
                    <p>Confirm if details are correct</p>
                  </div>
                </div>
                <div className="step col-md-4">
                  <span className="step-number">3</span>
                  <div className="step-desc">
                    <span className="step-title">Processing</span>
                    <p>Processing and showing details</p>
                  </div>
                </div>
              </div>
            </div>
            { this.state.newExchangeOrderDetails.orderStep === 0 &&
              <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="panel">
                  <div className="panel-body">
                    <div className="row">
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light pull-right"
                        onClick={ this.loadTestData }>
                        Load test data
                      </button>
                      <div className="col-lg-12 form-group form-material">
                        <a
                          className="pointer exchange-order-clear"
                          onClick={ this.clearOrder }>Clear</a>
                        <label
                          className="control-label select"
                          htmlFor="newExchangeOrderDetailsCoinSrc">
                          Source
                        </label>
                        <Select
                          id="newExchangeOrderDetailsCoinSrc"
                          name="newExchangeOrderDetails-coinSrc"
                          value={ this.state.newExchangeOrderDetails.coinSrc }
                          onChange={ (event) => this.updateSelectedCoin(event, 'src') }
                          optionRenderer={ this.renderCoinOption }
                          valueRenderer={ this.renderCoinOption }
                          options={ addCoinOptionsCrypto(this.coinsSrcList || this.props.Main.coins, null, true) } />
                      </div>
                      <div className="col-lg-12 form-group form-material">
                        <label
                          className="control-label select"
                          htmlFor="newExchangeOrderDetailsCoinDest">
                          Destination
                        </label>
                        <Select
                          id="newExchangeOrderDetailsCoinDest"
                          name="newExchangeOrderDetails-coinDest"
                          value={ this.state.newExchangeOrderDetails.coinDest }
                          onChange={ (event) => this.updateSelectedCoin(event, 'dest') }
                          optionRenderer={ this.renderCoinOption }
                          valueRenderer={ this.renderCoinOption }
                          options={ addCoinOptionsCrypto(this.coinsDestList || this.props.Main.coins, null, true) } />
                      </div>
                      <div className="col-lg-12 form-group form-material">
                        <button
                          type="button"
                          className="btn btn-default btn-send-self"
                          disabled={
                            Number(this.state.newExchangeOrderDetails.currentBalance) === 0 ||
                            this.state.newExchangeOrderDetails.currentBalance === 'none' ||
                            this.state.newExchangeOrderDetails.currentBalance === 'loading'
                          }
                          onClick={ this.setSendAmountAll }>
                          { translate('SEND.ALL') }
                        </button>
                        <label
                          className="control-label"
                          htmlFor="kmdWalletAmount">
                          <span>{ translate('INDEX.AMOUNT') }</span>
                          { this.state.newExchangeOrderDetails.currentBalance !== 'none' &&
                            this.state.newExchangeOrderDetails.currentBalance !== 'loading' &&
                            <span className="padding-left-5">
                              <strong>[ { this.state.newExchangeOrderDetails.currentBalance } ]</strong>
                            </span>
                          }
                          { this.state.newExchangeOrderDetails.currentBalance === 'loading' &&
                            <span className="padding-left-5">
                              <strong>[...]</strong>
                            </span>
                          }
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="newExchangeOrderDetails-amount"
                          disabled={
                            Number(this.state.newExchangeOrderDetails.currentBalance) === 0 ||
                            this.state.newExchangeOrderDetails.currentBalance === 'none' ||
                            this.state.newExchangeOrderDetails.currentBalance === 'loading'
                          }
                          value={ this.state.newExchangeOrderDetails.amount !== 0 ? this.state.newExchangeOrderDetails.amount : '' }
                          onChange={ this.updateInput }
                          id="kmdWalletAmount"
                          placeholder="0.000"
                          autoComplete="off" />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light pull-right"
                        onClick={ this.orderVerifyStep }>
                        { this.state.processing ? 'Please wait...' : 'Next' }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
            { this.state.newExchangeOrderDetails.orderStep === 1 &&
              <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="panel">
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-xs-12">
                        <strong>Source</strong>
                      </div>
                      <div className="col-lg-12 col-sm-12 col-xs-12"></div>
                    </div>
                    <div className="row padding-top-20">
                      <div className="col-xs-12">
                        <strong>Destination</strong>
                      </div>
                      <div className="col-lg-12 col-sm-12 col-xs-12"></div>
                    </div>
                    <div className="widget-body-footer">
                      <a className="btn btn-default waves-effect waves-light">Back</a>
                      <div className="widget-actions pull-right">
                        <button
                          type="button"
                          className="btn btn-primary">
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
      { this.state.newExchangeOrderDetails.step === 1 &&
        this.props.Main.coins &&
        this.props.Main.coins.spv.length > 1 &&
        <div className="step2">
          Deposit
        </div>
      }
      { this.props.Main.coins &&
        this.props.Main.coins.spv.length < 2 &&
        <div>Please activate Lite mode coins that you wish to exchange</div>
      }
    </section>
  );
};

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

  if (_items.length) {
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
  } else {
    return (
      <div>No history</div>
    );
  }
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
              { !this.state.newExchangeOrder &&
                <div className="margin-top-40 exchanges-history">
                  <h4>My exchange history</h4>
                  <button
                    type="button"
                    className="btn btn-xs white btn-info waves-effect waves-light btn-exchange-new"
                    onClick={ this.toggleCreateOrder }>
                    + New exchange order
                  </button>
                  <div>
                  { this._RenderExchangeHistory() }
                  </div>
                  <ExchangesOrderInfoModal provider={ this.state.provider } />
                </div>
              }
              { this.state.newExchangeOrder &&
                <div className="margin-top-40">
                  { this._RenderNewOrderForm() }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExchangesRender;