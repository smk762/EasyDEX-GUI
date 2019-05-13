import React from 'react';
import translate from '../../translate/translate';
import config from '../../config';
import { pubkeyToAddress } from 'agama-wallet-lib/src/keys';
import bitcoinjsNetworks from 'agama-wallet-lib/src/bitcoinjs-networks';
import { kmdAssetChains } from 'agama-wallet-lib/src/coin-helpers';

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
    this.confirmNativeStartupParams = this.confirmNativeStartupParams.bind(this);
  }

  componentWillReceiveProps(props) {
    if (!props.display) {
      this.setState({
        activeCoin: null,
      });
    }
  }

  confirmNativeStartupParams() {
    this.props.tileClickCB(
      this.state.activeCoin,
      this.state.daemonParam || this.state.genProcLimit || this.state.usePubkey ? {
        daemonParam: this.state.daemonParam,
        genProcLimit: this.state.genProcLimit,
        usePubkey: this.state.usePubkey,
      } : null
    );
    this.setActiveCoin();
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
    let daemonParam,
        genProcLimit,
        usePubkey;

    if (activeCoin &&
        this.props.activatedCoins &&
        this.props.activatedCoins[activeCoin.value] &&
        this.props.activatedCoins[activeCoin.value].params) {
      daemonParam = this.props.activatedCoins[activeCoin.value].params.daemonParam;
      genProcLimit = this.props.activatedCoins[activeCoin.value].params.genProcLimit;
      usePubkey = this.props.activatedCoins[activeCoin.value].params.usePubkey;
    }

    this.setState({
      activeCoin,
      daemonParam,
      genProcLimit,
      usePubkey,
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
          { translate('ADD_COIN.SELECT_STARTUP_PARAMS_FOR') } { this.state.activeCoin.label }
        </div>
        <div className="col-sm-6">
          <div className={ 'toggle-box ' + (this.state.daemonParam === 'gen' ? 'padding-bottom-20' : 'padding-bottom-35') }>
            <select
              className="form-control form-material"
              name="daemonParam"
              onChange={ (event) => this.updateInput(event) }
              value={ this.state.daemonParam }
              autoFocus>
              <option value="">{ translate('INDEX.DAEMON_PARAM') }: { translate('ADD_COIN.NONE') }</option>
              <option value="silent">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.BACKGROUND_PROCESS') }</option>
              <option value="reindex">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.REINDEX') }</option>
              <option value="rescan">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.RESCAN') }</option>
              <option value="gen">{ translate('INDEX.DAEMON_PARAM') }: gen</option>
              <option value="regtest">{ translate('INDEX.DAEMON_PARAM') }: regtest</option>
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
                  value={ this.state.genProcLimit }
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
                    className="toggle-label pointer"
                    onClick={ this.toggleUsePubkey }>
                    <span className="padding-right-15"></span>
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
            className="btn btn-default col-sm-2 float-none"
            onClick={ () => this.setActiveCoin() }>
            { translate('ADD_COIN.CANCEL') }
          </button>
          <button
            type="button"
            className="btn btn-primary col-sm-2 float-none margin-left-20"
            onClick={ this.confirmNativeStartupParams }>
            { translate('ADD_COIN.CONFIRM') }
          </button>
        </div>
      </div>
    );
  }

  renderTiles() {
    const coins = this.props.coins;
    let items = [];

    for (let i = 0; i < coins.length; i++) {
      let className = 'addcoin-tile';

      if (this.props.activatedCoins &&
          ((this.props.activatedCoins[coins[i].value] && this.props.activatedCoins[coins[i].value].mode === this.props.type) ||
           (this.props.activatedCoins[coins[i].value === 'ETH' ? coins[i].value : coins[i].value.split('|')[coins[i].value.indexOf('ETH|') > -1 ? 1 : 0]] && this.props.activatedCoins[coins[i].value === 'ETH' ? coins[i].value : coins[i].value.split('|')[coins[i].value.indexOf('ETH|') > -1 ? 1 : 0]].mode === this.props.type))) {
        className += ' activated';
      }

      if (this.props.activeCoins &&
          this.props.activeCoins[this.props.type] &&
          this.props.activeCoins[this.props.type].indexOf(this.props.type === 'eth' ? coins[i].value === 'ETH' ? coins[i].value : coins[i].value.split('|')[1].toUpperCase() : coins[i].value.split('|')[0].toUpperCase()) > -1) {
        className += ' activated disabled';
      }

      if (this.props.activeCoins &&
          ((this.props.type === 'native' && this.props.activeCoins.spv && (this.props.activeCoins.spv.indexOf(coins[i].value.split('|')[0].toUpperCase()) > -1 || (this.props.activatedCoins[coins[i].value] && this.props.activatedCoins[coins[i].value].mode === 'spv'))) || (this.props.type === 'spv' && this.props.activeCoins.native && (this.props.activeCoins.native.indexOf(coins[i].value.split('|')[0].toUpperCase()) > -1 || (this.props.activatedCoins[coins[i].value] && this.props.activatedCoins[coins[i].value].mode === 'native'))))) {
        className += ' hidden';
      }

      if (this.props.type === 'spv' &&
          this.props.kmdAcOnly &&
          kmdAssetChains.indexOf(coins[i].value.split('|')[0].toUpperCase()) === -1 &&
          className.indexOf('hidden') === -1) {
        className += ' hidden';
      }

      items.push(
        <div
          key={ `addcoin-tile-${i}` }
          className={ className }>
          { coins[i].value.indexOf('ETH|') > -1 &&
            coins[i].value !== 'ETH|ropsten' &&
            <div className="badge badge--erc20">ERC20</div>
          }
          { coins[i].value.indexOf('|native') > -1 &&
            coins[i].value !== 'ETH' &&
            this.props.type === 'native' &&
            <div
              onClick={ () => this.setActiveCoin(coins[i]) }
              className={ 'badge badge--native' + (this.props.activatedCoins && this.props.activatedCoins[coins[i].value] && this.props.activatedCoins[coins[i].value].params ? ' badge--native--active' : '') }>
              { translate('ADD_COIN.PARAMS') }
            </div>
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
          { translate('ADD_COIN.NO_RESULTS') }
        </div>
      );
    }

    return items;
  }

  render() {
    return (
      <div className="addcoin-tiles">
        { !this.state.activeCoin &&
          this.renderTiles()
        }
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