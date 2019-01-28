import React from 'react';
import translate from '../../../translate/translate';
import Config from '../../../config';
import { secondsToString } from 'agama-wallet-lib/src/time';
import {
  formatValue,
} from 'agama-wallet-lib/src/utils';

const statusLookup = {
  coinswitch: {
    timeout: 'expired',
    no_deposit: 'awaiting deposit',
  },
};

const ExchangesOrderInfoModalRender = function() {
  const _cache = this.props.Dashboard.exchanges && this.props.Dashboard.exchanges[this.props.provider];
  const _key = this.props.Dashboard.showExchangesOrderInfoId;
  const isSpv = true;
  const isEth = false;

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
                    { _cache[_key].inputTransactionHash &&
                      <li className={ this.state.activeTab === 1 ? 'active' : '' }>
                        <a onClick={ () => this.openTab(1) }>
                          <i className="icon wb-file"></i>Deposit Info
                        </a>
                      </li>
                    }
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
                              { _cache[_key].validTill &&
                                <tr>
                                  <td>
                                    Valid until
                                  </td>
                                  <td>
                                    { secondsToString(_cache[_key].validTill / 1000) }
                                  </td>
                                </tr>
                              }
                              <tr>
                                <td>
                                  Source
                                </td>
                                <td>
                                  <img
                                    className="margin-right-10"
                                    height="25px"
                                    src={ `assets/images/cryptologo/btc/${_cache[_key].depositCoin}.png` } />
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
                                    src={ `assets/images/cryptologo/btc/${_cache[_key].destinationCoin}.png`} />
                                  { formatValue(_cache[_key].expectedDestinationCoinAmount) } { _cache[_key].destinationCoin.toUpperCase() }
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Deposit address
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
                                  Deposit transaction hash
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
                                  { _cache[_key].outputTransactionHash ? 'complete' : statusLookup.coinswitch[_cache[_key].status] ? statusLookup.coinswitch[_cache[_key].status] : _cache[_key].status }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      }
                      { this.state.activeTab === 1 &&
                        <div className="tab-pane active">
                          { this.state.depositFetching &&
                            <div className="padding-top-20">Fetching transaction data...</div>
                          }
                          { !this.state.depositFetching &&
                            this.state.deposit &&
                            <div>
                              <table className="table table-striped">
                                <tbody>
                                  <tr>
                                    <td>From</td>
                                    <td className="blur selectable word-break--all">
                                      { this.state.deposit.inputAddresses ? this.state.deposit.inputAddresses[0] : 'N/A' }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>To</td>
                                    <td className="blur selectable word-break--all">
                                      { isSpv ? this.state.deposit.address : this.state.deposit.details[0] && this.state.deposit.details[0].address || txInfo.address }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{ this.capitalizeFirstLetter(translate('TX_INFO.AMOUNT')) }</td>
                                    <td>
                                      { isSpv ? (Number(this.state.deposit.amount) === 0 ? translate('DASHBOARD.UNKNOWN') : Number(this.state.deposit.amount)) : txInfo.amount }
                                    </td>
                                  </tr>
                                  { (isEth || (isSpv && this.state.deposit.amount !== this.state.deposit.fee)) &&
                                    <tr>
                                      <td>{ this.capitalizeFirstLetter(translate('SEND.FEE')) }</td>
                                      <td>
                                        { Number(this.state.deposit.fee) }
                                      </td>
                                    </tr>
                                  }
                                  <tr>
                                    <td>{ this.capitalizeFirstLetter(translate('TX_INFO.CONFIRMATIONS')) }</td>
                                    <td>
                                      { this.state.deposit.confirmations }
                                    </td>
                                  </tr>
                                  { this.state.deposit.blockindex &&
                                    <tr>
                                      <td>{ this.capitalizeFirstLetter('blockindex') }</td>
                                      <td className="selectable">
                                        { this.state.deposit.blockindex }
                                      </td>
                                    </tr>
                                  }
                                  { this.state.deposit.blockhash &&
                                    <tr>
                                      <td>{ isSpv ? this.capitalizeFirstLetter('blockheight') : this.capitalizeFirstLetter('blockhash') }</td>
                                      <td className="selectable">
                                        { isSpv ? this.state.deposit.height : this.state.deposit.blockhash }
                                      </td>
                                    </tr>
                                  }
                                  { (this.state.deposit.blocktime || this.state.deposit.timestamp) &&
                                    <tr>
                                      <td>{ this.capitalizeFirstLetter('blocktime') }</td>
                                      <td>
                                        { secondsToString(this.state.deposit.blocktime || this.state.deposit.timestamp) }
                                      </td>
                                    </tr>
                                  }
                                  <tr>
                                    <td>{ this.capitalizeFirstLetter('txid') }</td>
                                    <td className="blur selectable">
                                      { this.state.deposit.txid }
                                    </td>
                                  </tr>
                                  { this.state.deposit.walletconflicts &&
                                    <tr>
                                      <td>{ this.capitalizeFirstLetter('walletconflicts') }</td>
                                      <td>
                                        { this.state.deposit.walletconflicts.length }
                                      </td>
                                    </tr>
                                  }
                                  <tr>
                                    <td>{ this.capitalizeFirstLetter('time') }</td>
                                    <td>
                                      { secondsToString(isSpv ? this.state.deposit.blocktime || this.state.deposit.timestamp : this.state.deposit.time) }
                                    </td>
                                  </tr>
                                  { !isEth &&
                                    <tr>
                                      <td>{ this.capitalizeFirstLetter('timereceived') }</td>
                                      <td>
                                        { secondsToString(isSpv ? this.state.deposit.blocktime : this.state.deposit.timereceived) }
                                      </td>
                                    </tr>
                                  }
                                </tbody>
                              </table>
                              <div className="padding-top-15">
                                <button
                                  type="button"
                                  className="btn btn-sm white btn-dark waves-effect waves-light pull-left"
                                  onClick={ () => this.openExplorerWindow(_cache[_key].inputTransactionHash) }>
                                  <i className="icon fa-external-link"></i> { translate('INDEX.OPEN_TRANSACTION_IN_EPLORER', isEth ? 'Etherscan' : _cache[_key].depositCoin.toUpperCase()) }
                                </button>
                              </div>
                            </div>
                          }
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