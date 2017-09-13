import React from 'react';
import { translate } from '../../../translate/translate';

export const VerifyingBlocksRender = function() {
  return (
    <div className="progress-bar progress-bar-info progress-bar-striped active full-width font-size-80-percent">
      <span className="full-width">Verifying blocks...</span>
    </div>
  );
};

export const SyncErrorBlocksRender = function() {
  return (
    <div className="progress-bar progress-bar-info progress-bar-striped active full-width font-size-80-percent">
      <span className="full-width">{ translate('INDEX.SYNC_ERR_BLOCKS') }</span>
    </div>
  );
};

export const SyncPercentageRender = function(syncPercentage) {
  if (this.props.ActiveCoin.rescanInProgress) {
    return (
      <div
        className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
        style={{ width: '100%' }}>
        <span style={{ width: '100%' }}>Please wait until rescan process is finished</span>
      </div>
    );
  } else {
    if (syncPercentage === 'Infinity%') {
      return (
        <div
          className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
          style={{ width: syncPercentage }}>
          <span style={{ width: syncPercentage }}>Blocks: { this.props.ActiveCoin.progress.blocks } | { translate('INDEX.CONNECTIONS') }: { this.props.ActiveCoin.progress.connections }</span>
        </div>
      );
    } else {
      return (
        <div
          className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
          style={{ width: syncPercentage }}>
          <span style={{ width: syncPercentage }}>{ syncPercentage === '100.00%' ? '100%' : syncPercentage } | { this.props.ActiveCoin.progress.blocks } / { this.props.ActiveCoin.progress.longestchain } | { translate('INDEX.CONNECTIONS') }: { this.props.ActiveCoin.progress.connections }</span>
        </div>
      );
    }
  }
};

export const LoadingBlocksRender = function() {
  if (this.props.ActiveCoin.rescanInProgress) {
    return (
      <div
        className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
        style={{ width: '100%' }}>
        <span style={{ width: '100%' }}>Please wait until rescan process is finished</span>
      </div>
    );
  } else {
    return (
      <div
        className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
        style={{ width: '100%' }}>
        <span style={{ width: '100%' }}>{ translate('INDEX.LOADING_BLOCKS') }</span>
      </div>
    );
  }
};

export const TranslationComponentsRender = function(translationID) {
  const translationComponents = translate(translationID).split('<br>');

  return translationComponents.map((translation, idx) =>
    <span key={idx}>
      { translation }
      <br />
    </span>
  );
};

export const CoinIsBusyRender = function() {
  return (
    <div className="text-align-center padding-10">{ translate('INDEX.COIN_IS_BUSY') }</div>
  );
};

export const ChainActivationNotificationRender = function() {
  return (
    <div className="alert alert-info alert-dismissible margin-bottom-50 margin-top-40">
      <button
        className="close"
        type="button">
        <span>×</span>
      </button>
      <h4>{ translate('INDEX.ACTIVATING_CHAIN') } { this.props.ActiveCoin.rescanInProgress ? (this.renderRescanProgress() ? `: ${this.renderRescanProgress().toFixed(2)}% (rescanning blocks)` : '(rescanning blocks)') : this.renderActivatingBestChainProgress() }
      </h4>
      <p>{ this.renderLB('INDEX.KMD_STARTED') }</p>
    </div>
  );
};

export const WalletsProgressRender = function() {
  return (
    <div
      id="edex-footer"
      className="margin-bottom-30 margin-top-10">
      { !this.isNativeMode() &&
        this.props.ActiveCoin.progress &&
        <div className="row no-space">
          <div id="currency-progressbars">
            <div className="progress progress-sm">
              <div className={ 'full-width font-size-80-percent '
              + (this.isFullySynced() ? 'progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success' : 'hide') }>
                { translate('INDEX.BUNDLES') }&nbsp;
                <span id="currency-bundles-percent">({ this.props.ActiveCoin.coin }) 100.00% - ( { this.props.ActiveCoin.progress.blocks }
                / { this.props.ActiveCoin.progress.blocks } ) ==&gt;&gt;
                RT{ this.props.ActiveCoin.progress.RTheight }</span>
              </div>
              <div
                className={ 'font-size-80-percent '
                + (this.isFullySynced() ? 'hide' : 'progress-bar progress-bar-info progress-bar-striped active') }
                style={{ width: `${this.props.ActiveCoin.progress.bundles}%` }}>
                { translate('INDEX.BUNDLES') } { this.props.ActiveCoin.progress.bundles }%
              </div>
            </div>
          </div>
          <div className={ this.isFullySynced() ? 'hide' : '' }>
            <div className="progress progress-sm">
              <div
                className="progress-bar progress-bar-warning progress-bar-striped active font-size-80-percent"
                style={{ width: `${this.props.ActiveCoin.progress.utxo}%` }}>
                utxo { this.props.ActiveCoin.progress.utxo }%
              </div>
            </div>
            <div className="progress progress-sm">
              <div
                className="progress-bar progress-bar-danger progress-bar-striped active font-size-80-percent"
                style={{ width: `${this.props.ActiveCoin.progress.balances}%` }}>
                { translate('INDEX.BALANCES') } { this.props.ActiveCoin.progress.balances }%
              </div>
            </div>
            <div className="progress progress-sm">
              <div
                className="progress-bar progress-bar-success progress-bar-striped active font-size-80-percent"
                style={{ width: `${this.props.ActiveCoin.progress.validated}%` }}>
                { translate('INDEX.VALIDATED') } { this.props.ActiveCoin.progress.validated }%
              </div>
            </div>
          </div>
        </div>
      }

      { this.isNativeMode() &&
        <div>
          { this.renderChainActivationNotification() }
          <div className="row sync-progress-container">
            <div className="col-xs-12">
              <div className="progress">
                { this.renderSyncPercentagePlaceholder() }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};