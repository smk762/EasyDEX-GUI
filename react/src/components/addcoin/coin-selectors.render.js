import React from 'react';
import { translate } from '../../translate/translate';
import AddCoinOptionsCrypto from '../addcoin/addcoinOptionsCrypto';
import AddCoinOptionsAC from '../addcoin/addcoinOptionsAC';
import AddCoinOptionsACFiat from '../addcoin/addcoinOptionsACFiat';

const CoinSelectorsRender = function(item, coin, i) {
  // const isWindows = this.props.Settings && this.props.Settings.appInfo && this.props.Settings.appInfo.sysInfo && this.props.Settings.appInfo.sysInfo.platform === 'win32';
  const hideFullModeBtn = item && item.selectedCoin && item.selectedCoin.indexOf('|full') === -1 || !this.state.isExperimentalOn ? true : false;

  return (
    <div
      className={ this.hasMoreThanOneCoin() ? 'multi' : 'single' }
      key={ `add-coin-${i}` }>
      <div
        className={ this.hasMoreThanOneCoin() ? 'col-sm-10' : 'col-sm-8' }
        style={{ paddingLeft: !this.hasMoreThanOneCoin() ? '0' : '15px' }}>
        <div
          className={ this.hasMoreThanOneCoin() && (item.mode === '-1' || item.mode === -1) ? 'col-sm-6 form-group' : 'form-group' }
          style={{ paddingLeft: this.hasMoreThanOneCoin() ? '0' : '15px' }}>
          <select
            className="form-control form-material"
            name="selectedCoin"
            value={ coin }
            onChange={ (event) => this.updateSelectedCoin(event, i) }
            autoFocus>
            <option>{ translate('INDEX.SELECT') }</option>
            <AddCoinOptionsCrypto appSettings={ this.props.Settings } />
            <AddCoinOptionsAC appSettings={ this.props.Settings } />
            <AddCoinOptionsACFiat appSettings={ this.props.Settings } />
          </select>
        </div>
        <div className={ this.hasMoreThanOneCoin() && (item.mode === '-1' || item.mode === -1) ? 'col-sm-6' : 'hide' }>
          <div className="toggle-box padding-bottom-10">
            <select
              className="form-control form-material"
              name="daemonParam"
              onChange={ (event) => this.updateDaemonParam(event, i) }
              autoFocus>
              <option>Daemon param: none</option>
              <option value="silent">Daemon param: background process</option>
              <option value="reindex">Daemon param: reindex</option>
              <option value="rescan">Daemon param: rescan</option>
            </select>
          </div>
        </div>
      </div>
      <div className={ this.hasMoreThanOneCoin() ? 'hide' : 'col-sm-4' }>
        <button
          type="button"
          className="btn btn-primary"
          onClick={ () => this.activateCoin(i) }
          disabled={ item.mode === -2 }>
            { translate('INDEX.ACTIVATE_COIN') }
        </button>
      </div>
      <div className="col-sm-11 text-center add-coin-modes">
        <div className={ this.state.nativeOnly || hideFullModeBtn ? 'hide' : 'form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 style-addcoin-lbl-mdl-login' }>
          <input
            type="radio"
            className="to-labelauty labelauty"
            name={ `mode-${i}` }
            id={ `addcoin_mdl_full_mode_login-${i}` }
            disabled={ item.fullMode.disabled }
            checked={ item.fullMode.checked } />
          <label
            htmlFor={ `addcoin_mdl_full_mode_login-${i}` }
            onClick={ () => this.updateSelectedMode('1', i) }
            style={{ pointerEvents: item.fullMode.disabled ? 'none' : 'all' }}>
            <span
              className="labelauty-unchecked-image"
              style={{ display: item.fullMode.checked ? 'none' : 'inline-block' }}></span>
            <span
              className="labelauty-unchecked"
              style={{ display: item.fullMode.checked ? 'none' : 'inline-block' }}>
                { translate('INDEX.FULL_MODE') }
            </span>
            <span
              className="labelauty-checked-image"
              style={{ display: item.fullMode.checked ? 'inline-block' : 'none' }}></span>
            <span
              className="labelauty-checked"
              style={{ display: item.fullMode.checked ? 'inline-block' : 'none' }}>
                { translate('INDEX.FULL_MODE') }
            </span>
          </label>
        </div>
        <div className={ this.state.nativeOnly ? 'hide' : 'form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 style-addcoin-lbl-mdl-login' }>
          <input
            type="radio"
            className="to-labelauty labelauty"
            name={ `mode-${i}` }
            id={ `addcoin_mdl_basilisk_mode_login-${i}` }
            disabled={ item.basiliskMode.disabled }
            checked={ item.basiliskMode.checked } />
          <label
            htmlFor={ `addcoin_mdl_basilisk_mode_login-${i}` }
            onClick={ () => this.updateSelectedMode('0', i) }
            style={{ pointerEvents: item.basiliskMode.disabled ? 'none' : 'all' }}>
            <span
              className="labelauty-unchecked-image"
              style={{ display: item.basiliskMode.checked ? 'none' : 'inline-block' }}></span>
            <span
              className="labelauty-unchecked"
              style={{ display: item.basiliskMode.checked ? 'none' : 'inline-block' }}>
                { translate('INDEX.BASILISK_MODE') }
            </span>
            <span
              className="labelauty-checked-image"
              style={{ display: item.basiliskMode.checked ? 'inline-block' : 'none' }}></span>
            <span
              className="labelauty-checked"
              style={{ display: item.basiliskMode.checked ? 'inline-block' : 'none' }}>
                { translate('INDEX.BASILISK_MODE') }
            </span>
          </label>
        </div>
        <div
          className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6"
          style={{ paddingLeft: this.state.nativeOnly ? '0' : 'inherit' }}>
          <input
            type="radio"
            className="to-labelauty labelauty"
            name={ `mode-${i}` }
            id={ `addcoin_mdl_native_mode_login-${i}` }
            disabled={ item.nativeMode.disabled }
            checked={ item.nativeMode.checked } />
          <label
            htmlFor={ `addcoin_mdl_native_mode_login-${i}` }
            onClick={ () => this.updateSelectedMode('-1', i) }
            style={{ pointerEvents: item.nativeMode.disabled ? 'none' : 'all' }}>
            <span
              className="labelauty-unchecked-image"
              style={{ display: item.nativeMode.checked ? 'none' : 'inline-block' }}></span>
            <span
              className="labelauty-unchecked"
              style={{ display: item.nativeMode.checked ? 'none' : 'inline-block' }}>
                { translate('INDEX.NATIVE_MODE') }
            </span>
            <span
              className="labelauty-checked-image"
              style={{ display: item.nativeMode.checked ? 'inline-block' : 'none' }}></span>
            <span
              className="labelauty-checked"
              style={{ display: item.nativeMode.checked ? 'inline-block' : 'none' }}>
                { translate('INDEX.NATIVE_MODE') }
            </span>
          </label>
        </div>
      </div>
      <div className={ this.hasMoreThanOneCoin() && i !== 0 ? 'col-sm-1' : 'hide' }>
        <button
          type="button"
          className="btn btn-primary"
          onClick={ () => this.removeCoin(i) }>
            <i className="fa fa-trash-o"></i>
        </button>
      </div>
      <div className={ !this.hasMoreThanOneCoin() && (item.mode === '-1' || item.mode === -1) ? 'col-sm-5 padding-bottom-30' : 'hide' }>
        <div className="toggle-box padding-top-3 padding-bottom-10">
          <select
            className="form-control form-material"
            name="daemonParam"
            onChange={ (event) => this.updateDaemonParam(event, i) }
            autoFocus>
            <option>{ translate('INDEX.DAEMON_PARAM') }: none</option>
            <option value="silent">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.BACKGROUND_PROCESS') }</option>
            <option value="reindex">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.REINDEX') }</option>
            <option value="rescan">{ translate('INDEX.DAEMON_PARAM') }: { translate('INDEX.RESCAN') }</option>
          </select>
        </div>
      </div>
      <div className={ (item.mode === '1' || item.mode === 1) && this.state.isExperimentalOn ? 'col-sm-12' : 'hide' }>
        <div className="toggle-box padding-top-3 padding-bottom-10">
          <span className="pointer">
            <label className="switch">
              <input
                type="checkbox"
                checked={ item.syncOnly } />
              <div
                className="slider"
                onClick={ () => this.toggleSyncOnlyMode(i) }></div>
            </label>
            <div
              className="toggle-label"
              onClick={ () => this.toggleSyncOnlyMode(i) }>
                { translate('ADD_COIN.SYNC_ONLY') }
            </div>
          </span>
        </div>
      </div>
    </div>
  )
};

export default CoinSelectorsRender;