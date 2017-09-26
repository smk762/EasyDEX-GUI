import React from 'react';
import { translate } from '../../../translate/translate';

export const VerifyingBlocksRender = function() {
  return (
    <div className="progress-bar progress-bar-info progress-bar-striped active full-width font-size-80-percent">
      <span className="full-width">{ translate('INDEX.VERIFYING_BLOCKS') }...</span>
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

export const SyncPercentageRender = function(syncPercentage, currentBlock, maxHeight) {
  if (this.props.ActiveCoin.rescanInProgress) {
    return (
      <div
        className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
        style={{ width: '100%' }}>
        <span style={{ width: '100%' }}>{ translate('INDEX.PLEASE_WAIT_UNTIL_RESCAN_FINISHED') }</span>
      </div>
    );
  } else {
    if (syncPercentage === 'Infinity%') {
      return (
        <div
          className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
          style={{ width: syncPercentage }}>
          <span style={{ width: syncPercentage }}>
            { translate('INDEX.BLOCKS') }:&nbsp;
            { this.props.ActiveCoin.progress.blocks }&nbsp;|&nbsp;
            { translate('INDEX.CONNECTIONS') }:&nbsp;
            { this.props.ActiveCoin.progress.connections }
          </span>
        </div>
      );
    } else {
      return (
        <div
          className="progress-bar progress-bar-info progress-bar-striped active font-size-80-percent"
          style={{ width: syncPercentage }}>
          <span style={{ width: syncPercentage }}>
            { syncPercentage === '100.00%' ? '100%' : syncPercentage }&nbsp;
            <span className={ this.props.ActiveCoin.progress.blocks || currentBlock ? '' : 'hide' }>|&nbsp;
              { this.props.ActiveCoin.progress.blocks || currentBlock }&nbsp;
              <span className={ this.props.ActiveCoin.progress.longestchain || maxHeight ? '' : 'hide'}>/&nbsp;
              { this.props.ActiveCoin.progress.longestchain || maxHeight }
              </span>
            </span>&nbsp;
            <span className={ this.props.ActiveCoin.progress.connections ? '' : 'hide' }>|&nbsp;
              { translate('INDEX.CONNECTIONS') }:&nbsp;
              { this.props.ActiveCoin.progress.connections }
            </span>
          </span>
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
        <span style={{ width: '100%' }}>{ translate('INDEX.PLEASE_WAIT_UNTIL_RESCAN_FINISHED') }</span>
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

export const ChainActivationNotificationRender = function() {
  if (this.props.ActiveCoin.coin !== 'CHIPS') {
    return (
      <div className="alert alert-info alert-dismissible margin-bottom-50">
        <h4>
          { translate('INDEX.ACTIVATING_CHAIN') }&nbsp;
          { this.props.ActiveCoin.rescanInProgress ? (this.renderRescanProgress() ? `: ${this.renderRescanProgress().toFixed(2)}% ${translate('INDEX.PROGRESS_RESCANNING_BLOCKS')}` : translate('INDEX.PROGRESS_RESCANNING_BLOCKS')) : this.renderActivatingBestChainProgress() }
        </h4>
        <p>{ this.renderLB('INDEX.KMD_STARTED') }</p>
      </div>
    );
  } else {
    return null;
  }
};

export const WalletsProgressRender = function() {
  return (
    <div
      id="edex-footer"
      className="margin-bottom-30 margin-top-10">
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
    </div>
  );
};