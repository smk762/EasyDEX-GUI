import React from 'react';
import { translate } from '../../../translate/translate';

export const SyncErrorLongestChainRender = function() {
  return (
    <div className="progress-bar progress-bar-info progress-bar-striped active full-width font-size-80-percent">
      <span className="full-width">{ translate('INDEX.SYNC_ERR_LONGESTCHAIN') }</span>
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

export const SyncPercentageRender =  function(syncPercentage) {
  return (
    <div
      className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
      style={{ width: syncPercentage }}>
      <span style={{ width: syncPercentage }}>{ syncPercentage }</span> | { this.props.Dashboard.progress.blocks } / { this.props.Dashboard.progress.longestchain } | { translate('INDEX.CONNECTIONS') }: { this.props.Dashboard.progress.connections }
    </div>
  );
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
}

export const ChainActivationNotificationRender = function() {
  return (
    <div className="alert alert-info alert-dismissible margin-bottom-40">
      <button
        className="close"
        type="button">
        <span>×</span>
      </button>
      <h4>
        { translate('INDEX.ACTIVATING_CHAIN') }{ this.renderActivatingBestChainProgress() }
      </h4>
      <p>{ this.renderLB('INDEX.KMD_STARTED') }</p>
    </div>
  );
};

export const WalletsProgressRender = function () {
  return (
    <div
      id="edex-footer"
      className="margin-bottom-20">

      { !this.isNativeMode() &&
      <div className="row no-space">
        <div id="currency-progressbars">
          <div className="progress progress-sm">
            <div className={ 'full-width font-size-80-percent '
            + (this.isFullySynced() ? 'progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success' : 'hide') }>
              { translate('INDEX.BUNDLES') } <span id="currency-bundles-percent">({ this.props.ActiveCoin.coin }) 100.00% - ( { this.props.Dashboard.progress.blocks }
              / { this.props.Dashboard.progress.blocks } ) ==&gt;&gt;
              RT{ this.props.Dashboard.progress.RTheight }</span>
            </div>
            <div
              className={ 'font-size-80-percent '
              + (this.isFullySynced() ? 'hide' : 'progress-bar progress-bar-info progress-bar-striped active') }
              style={{width: this.props.Dashboard.progress.bundles + '%'}}>
              { translate('INDEX.BUNDLES') } { this.props.Dashboard.progress.bundles }%
            </div>
          </div>
        </div>
        <div className={ this.isFullySynced() ? 'hide' : '' }>
          <div className="progress progress-sm">
            <div
              className="progress-bar progress-bar-warning progress-bar-striped active font-size-80-percent"
              style={{width: this.props.Dashboard.progress.utxo + '%'}}>
              utxo { this.props.Dashboard.progress.utxo }%
            </div>
          </div>
          <div className="progress progress-sm">
            <div
              className="progress-bar progress-bar-danger progress-bar-striped active font-size-80-percent"
              style={{width: this.props.Dashboard.progress.balances + '%'}}>
              { translate('INDEX.BALANCES') } { this.props.Dashboard.progress.balances }%
            </div>
          </div>
          <div className="progress progress-sm">
            <div
              className="progress-bar progress-bar-success progress-bar-striped active font-size-80-percent"
              style={{width: this.props.Dashboard.progress.validated + '%'}}>
              { translate('INDEX.VALIDATED') } { this.props.Dashboard.progress.validated }%
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