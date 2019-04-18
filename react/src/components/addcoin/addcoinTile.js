import React from 'react';
import translate from '../../translate/translate';
import config from '../../config';
import { pubkeyToAddress } from 'agama-wallet-lib/src/keys';
import bitcoinjsNetworks from 'agama-wallet-lib/src/bitcoinjs-networks';

class AddCoinTile extends React.Component {
  constructor() {
    super();
    this.state = {
      activeCoin: null,
      daemonParam: null,
      genProcLimit: null,
      usePubkey: false,
    };
    this.setActiveCoin = this.setActiveCoin.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.toggleUsePubkey = this.toggleUsePubkey.bind(this);
  }

  toggleUsePubkey() {
    this.setState({
      usePubkey: !this.state.usePubkey,
    });
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  setActiveCoin(activeCoin) {
    this.setState({
      activeCoin,
    });
  }

  renderGenproclimitOptions() {
    const _max = 32;
    let _items = [];

    for (let i = 0; i < _max; i++) {
      _items.push(
        <option
          key={ `addcoin-genproclimit-${i}` }
          value={ i + 1 }>
          { translate('ADD_COIN.MINING_THREADS') }: { i + 1 }
        </option>
      );
    }

    return _items;
  }

  renderNativeParamsModal() {
    let pubkeyAddress;
    if (config.pubkey) {
      pubkeyAddress = pubkeyToAddress(config.pubkey, bitcoinjsNetworks.kmd);
  
      if (!pubkeyAddress) {
        pubkeyAddress = translate('TOASTR.INVALID_PUBKEY');
      }
    }

    return (
      <div className="native-params-modal">
        <hr />
        <div className="col-sm-12 padding-top-10 padding-bottom-30">
          Select startup parameters for { this.state.activeCoin.label }
        </div>
        <div className="col-sm-6">
          <div className={ 'toggle-box ' + (this.state.daemonParam === 'gen' ? 'padding-bottom-20' : 'padding-bottom-35') }>
            <select
              className="form-control form-material"
              name="daemonParam"
              onChange={ (event) => this.updateInput(event) }
              autoFocus>
              <option>{ translate('INDEX.DAEMON_PARAM') }: { translate('ADD_COIN.NONE') }</option>
              <option value="silent">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.BACKGROUND_PROCESS') }</option>
              <option value="reindex">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.REINDEX') }</option>
              <option value="rescan">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.RESCAN') }</option>
              <option value="gen">{ translate('INDEX.DAEMON_PARAM') }: gen</option>
            </select>
          </div>
        </div>
        { this.state.daemonParam === 'gen' &&
          <div className="col-sm-12">
            <div className="col-sm-6 padding-bottom-30 no-padding-left">
              <div className="toggle-box padding-bottom-10">
                <select
                  className="form-control form-material"
                  name="genProcLimit"
                  onChange={ (event) => this.updateInput(event) }
                  autoFocus>
                  { this.renderGenproclimitOptions() }
                </select>
              </div>
            </div>
          </div>
        }
        { config &&
          config.pubkey &&
          <div className="col-sm-12">
            <div className="col-sm-12 no-padding-left">
              <div className="toggle-box padding-bottom-10">
                <span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={ this.state.usePubkey }
                      readOnly />
                    <div
                      className="slider"
                      onClick={ this.toggleUsePubkey }></div>
                  </label>
                  <div
                    className="toggle-label margin-right-15 pointer"
                    onClick={ this.toggleUsePubkey }>
                    { translate('INDEX.USE_PUBKEY') }
                  </div>
                </span>
              </div>
            </div>
            { this.state.usePubkey &&
              <div className="col-sm-12 padding-bottom-35 no-padding-left">
                <div className="padding-bottom-15">
                  <strong>{ translate('INDEX.PUBKEY') }:</strong> { config.pubkey }
                </div>
                <strong>{ translate('INDEX.ADDRESS') }:</strong> { pubkeyAddress }
              </div>
            }
          </div>
        }
        <div className="col-sm-12 padding-bottom-40 padding-top-15">
          <button
            type="button"
            className="btn btn-default col-sm-2 float-none">
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary col-sm-2 float-none margin-left-20"
            onClick={ () => this.props.tileClickCB(coins[i], { daemonParam: this.state.daemonParam, genProcLimit: this.state.genProcLimit,  }) }>
            Confirm
          </button>
        </div>
      </div>
    );
  }

  renderTiles() {
    const coins = this.props.coins;
    let items = [];

    for (let i = 0; i < coins.length; i++) {
      console.log(coins[i]);

      items.push(
        <div
          key={ `addcoin-tile-${i}` }
          className="addcoin-tile">
          { coins[i].value.indexOf('ETH|') > -1 &&
            coins[i].value !== 'ETH|ropsten' &&
            <div className="badge badge--erc20">ERC20</div>
          }
          { coins[i].value.indexOf('|native') > -1 &&
            coins[i].value !== 'ETH' &&
            this.props.type === 'native' &&
            <div
              onClick={ () => this.setActiveCoin(coins[i]) }
              className="badge badge--native">Params</div>
          }
          <div
            className="addcoin-tile-inner"
            onClick={ () => this.props.tileClickCB(coins[i]) }>
            <img
              src={ `assets/images/cryptologo/${coins[i].icon.toLowerCase()}.png` }
              alt={ coins[i].label }
              width="30px"
              height="30px" />
            <span className="margin-left-10">{ coins[i].label }</span>
          </div>
        </div>
      );
    }

    if (!items.length) {
      items.push(
        <div
          key="addcoin-tile-empty">
          No matching results found
        </div>
      );
    }

    return items;
  }

  render() {
    return (
      <div className="addcoin-tiles">
        { !this.state.activeCoin &&
          this.renderTiles() }
        {
          this.props.type === 'native' &&
          this.state.activeCoin &&
          this.renderNativeParamsModal()
        }
      </div>
    );
  }
}

export default AddCoinTile;