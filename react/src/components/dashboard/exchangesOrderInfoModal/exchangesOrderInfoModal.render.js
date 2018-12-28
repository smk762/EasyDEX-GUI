import React from 'react';
import translate from '../../../translate/translate';
import Config from '../../../config';
import { secondsToString } from 'agama-wallet-lib/src/time';
import {
  formatValue,
} from 'agama-wallet-lib/src/utils';

const ExchangesOrderInfoModalRender = function() {
  const _cache = this.props.Dashboard.exchanges && this.props.Dashboard.exchanges[this.props.provider];
  const _key = this.props.Dashboard.showExchangesOrderInfoId;

  if (_cache &&
      _key) {
    return (
      <div onKeyDown={ (event) => this.handleKeydown(event) }>
        <div
          className={ `modal modal-3d-sign tx-details-modal ${this.state.className}` }
          id="kmd_txid_info_mdl">
          <div
            onClick={ this._toggleExchangesOrderInfoModal }
            className="modal-close-overlay"></div>
          <div className="modal-dialog modal-center modal-lg">
            <div
              onClick={ this._toggleExchangesOrderInfoModal }
              className="modal-close-overlay"></div>
            <div className="modal-content">
              <div className="modal-header bg-orange-a400 wallet-send-header">
                <button
                  type="button"
                  className="close white"
                  onClick={ this._toggleExchangesOrderInfoModal }>
                  <span>×</span>
                </button>
                <h4 className="modal-title white">
                  Exchange Order Details
                </h4>
              </div>
              <div className="modal-body modal-body-container">
                <div className="panel nav-tabs-horizontal">
                  <ul className="nav nav-tabs nav-tabs-line">
                    <li className={ this.state.activeTab === 0 ? 'active' : '' }>
                      <a onClick={ () => this.openTab(0) }>
                        <i className="icon md-balance-wallet"></i>Order Info
                      </a>
                    </li>
                    <li className={ this.state.activeTab === 1 ? 'active' : '' }>
                      <a onClick={ () => this.openTab(1) }>
                        <i className="icon wb-file"></i>Deposit Info
                      </a>
                    </li>
                  </ul>
                  <div className="panel-body">
                    <div className="tab-content">
                      { this.state.activeTab === 0 &&
                        <div className="tab-pane active">
                          <table className="table table-striped">
                            <tbody>
                              <tr>
                                <td>
                                  Date
                                </td>
                                <td>
                                  { secondsToString(_cache[_key].createdAt / 1000) }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Valid until
                                </td>
                                <td>
                                  { secondsToString(_cache[_key].validTill / 1000) }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Source
                                </td>
                                <td>
                                  <img
                                    className="margin-right-10"
                                    height="25px"
                                    src={ `assets/images/cryptologo/${_cache[_key].depositCoin}.png` } />
                                  { formatValue(_cache[_key].expectedDepositCoinAmount) } { _cache[_key].depositCoin.toUpperCase() }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Destination
                                </td>
                                <td>
                                  <img
                                    className="margin-right-10"
                                    height="25px"
                                    src={ `assets/images/cryptologo/${_cache[_key].destinationCoin}.png`} />
                                  { formatValue(_cache[_key].expectedDestinationCoinAmount) } { _cache[_key].destinationCoin.toUpperCase() }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Source address
                                </td>
                                <td className="blur selectable word-break--all">
                                  { _cache[_key].exchangeAddress.address }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Destination address
                                </td>
                                <td className="blur selectable word-break--all">
                                  { _cache[_key].destinationAddress.address }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Source transaction hash
                                </td>
                                <td className="blur selectable word-break--all">
                                  { _cache[_key].inputTransactionHash }
                                </td>
                              </tr>
                              <tr>
                                <td className="blur selectable word-break--all">
                                  Destination transaction hash
                                </td>
                                <td className="blur selectable word-break--all">
                                  { _cache[_key].outputTransactionHash }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Order ID
                                </td>
                                <td className="blur selectable word-break--all">
                                  { _cache[_key].orderId }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Status
                                </td>
                                <td>
                                  { _cache[_key].status }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      }
                      { this.state.activeTab === 1 &&
                        <div className="tab-pane active">
                          <table className="table table-striped">
                            <tbody>
                              <tr>
                                <td>From</td>
                                <td className="selectable">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={ `modal-backdrop ${this.state.className}` }></div>
      </div>
    );
  } else {
    return null;
  }
};

export default ExchangesOrderInfoModalRender;