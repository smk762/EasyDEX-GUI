import React from 'react';
import { translate } from '../../../translate/translate';
import AddCoinOptionsCrypto from '../../addcoin/addcoinOptionsCrypto';
import AddCoinOptionsAC from '../../addcoin/addcoinOptionsAC';
import AddCoinOptionsACFiat from '../../addcoin/addcoinOptionsACFiat';

<div
                    id="AddNodeforCoin"
                    onClick={ () => this.openTab('AddNodeforCoin', 1) }
                    className={ 'panel' + (this.state.nativeOnly ? ' hide' : '') }>
                    <div className="panel-heading">
                      <a className={ 'panel-title' + (this.state.activeTab === 1 ? '' : ' collapsed') }>
                        <i className="icon md-plus-square"></i>{ translate('INDEX.ADD_NODE') }
                      </a>
                    </div>
                    <div
                      className={ 'panel-collapse collapse' + (this.state.activeTab === 1 ? ' in' : '') }
                      style={{ height: this.state.activeTab === 1 ? `${this.state.activeTabHeight}px` : '0' }}>
                      <div className="panel-body">
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="col-sm-12">
                              <p>{ translate('INDEX.USE_THIS_SECTION') }</p>
                            </div>
                            <div className="col-sm-8 col-xs-12">
                              <div className="form-group">
                                <select
                                  className="form-control form-material"
                                  name="getPeersCoin"
                                  onChange={ this.updateInput }>
                                  <option>{ translate('INDEX.SELECT_COIN') }</option>
                                  <AddCoinOptionsCrypto />
                                  <AddCoinOptionsAC />
                                  <AddCoinOptionsACFiat />
                                </select>
                              </div>
                            </div>
                            <div className="col-sm-4 col-xs-12 text-align-center">
                              <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                onClick={ this.checkNodes }>{ translate('INDEX.CHECK_NODES') }</button>
                            </div>
                            <div className="col-sm-12">
                              <h5>
                                SuperNET Peers:
                              </h5>
                              <p>{ this.renderSNPeersList() }</p>
                              <h5>
                                Raw Peers:
                              </h5>
                              <p>{ this.renderPeersList() }</p>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="col-sm-12">
                              <p>{ translate('INDEX.USE_THIS_SECTION_PEER') }</p>
                            </div>
                            <div className="col-sm-8 col-xs-12">
                              <div className="form-group">
                                <select
                                  className="form-control form-material"
                                  name="addNodeCoin"
                                  onChange={ this.updateInput }>
                                  <option>{ translate('INDEX.SELECT_COIN') }</option>
                                  <AddCoinOptionsCrypto />
                                  <AddCoinOptionsAC />
                                  <AddCoinOptionsACFiat />
                                </select>
                              </div>
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="addPeerIP"
                                  placeholder={ translate('SETTINGS.ADD_PEER_IP') }
                                  onChange={ this.updateInput } />
                              </div>
                            </div>
                            <div className="col-sm-4 col-xs-12 text-align-center">
                              <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                onClick={ this.addNode }>{ translate('INDEX.ADD_NODE') }</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>