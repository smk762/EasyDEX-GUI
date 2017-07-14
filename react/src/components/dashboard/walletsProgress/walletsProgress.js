import React from 'react';
import {
  SyncErrorLongestChainRender,
  SyncErrorBlocksRender,
  SyncPercentageRender,
  LoadingBlocksRender,
  TranslationComponentsRender,
  CoinIsBusyRender,
  ChainActivationNotificationRender,
  WalletsProgressRender
} from './walletsProgress.render';

class WalletsProgress extends React.Component {
  constructor(props) {
    super(props);
    this.isFullySynced = this.isFullySynced.bind(this);
  }

  isFullySynced() {
    if ((Number(this.props.Dashboard.progress.balances) +
        Number(this.props.Dashboard.progress.validated) +
        Number(this.props.Dashboard.progress.bundles) +
        Number(this.props.Dashboard.progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
  }

  isNativeMode() {
    return this.props.ActiveCoin.mode === 'native';
  }

  isFullMode() {
    return this.props.ActiveCoin.mode === 'full';
  }

  renderChainActivationNotification() {
    if (this.props.Dashboard.progress) {
      if ((!this.props.Dashboard.progress.blocks && !this.props.Dashboard.progress.longestchain) ||
          (this.props.Dashboard.progress.blocks < this.props.Dashboard.progress.longestchain)) {
        return ChainActivationNotificationRender.call(this);
      }
    } else {
      return null;
    }
  }

  renderSyncPercentagePlaceholder() {
    if (this.props.Dashboard.progress &&
        this.props.Dashboard.progress.blocks > 0 &&
        this.props.Dashboard.progress.longestchain === 0) {
      return SyncErrorLongestChainRender.call(this);
    }

    if (this.props.Dashboard.progress &&
        this.props.Dashboard.progress.blocks === 0) {
      return SyncErrorBlocksRender.call(this);
    }

    if (this.props.Dashboard.progress &&
        this.props.Dashboard.progress.blocks) {
      const syncPercentage = (parseFloat(parseInt(this.props.Dashboard.progress.blocks, 10) * 100
        / parseInt(this.props.Dashboard.progress.longestchain, 10)).toFixed(2) + '%').replace('NaN', 0);
      return SyncPercentageRender.call(this, syncPercentage);
    }

    return LoadingBlocksRender.call(this);
  }

  renderLB(translationID) {
    return TranslationComponentsRender.call(this, translationID);
  }

  renderActivatingBestChainProgress() {
    if (this.props.Settings &&
        this.props.Settings.debugLog) {
      if (this.props.Settings.debugLog.indexOf('UpdateTip') > -1 &&
          !this.props.Dashboard.progress &&
          !this.props.Dashboard.progress.blocks) {
        const temp = this.props.Settings.debugLog.split(' ');
        let currentBestChain;
        let currentProgress;

        for (let i = 0; i < temp.length; i++) {
          if (temp[i].indexOf('height=') > -1) {
            currentBestChain = temp[i].replace('height=', '');
          }
          if (temp[i].indexOf('progress=') > -1) {
            currentProgress = Number(temp[i].replace('progress=', '')) * 100;
          }
        }

        // fallback to local data if remote node is inaccessible
        if (this.props.Dashboard.progress.remoteKMDNode &&
            !this.props.Dashboard.progress.remoteKMDNode.blocks) {
          return (
            `: ${currentProgress}% (${ translate('INDEX.ACTIVATING_SM') })`
          );
        } else {
          if (this.props.Dashboard.progress.remoteKMDNode &&
              this.props.Dashboard.progress.remoteKMDNode.blocks) {
            return(
              `: ${Math.floor(currentBestChain * 100 / this.props.Dashboard.progress.remoteKMDNode.blocks)}% (${ translate('INDEX.BLOCKS_SM') } ${currentBestChain} / ${this.props.Dashboard.progress.remoteKMDNode.blocks})`
            );
          }
        }
      } else if (
          this.props.Settings.debugLog.indexOf('Still rescanning') > -1 &&
          !this.props.Dashboard.progress ||
          !this.props.Dashboard.progress.blocks
        ) {
        const temp = this.props.Settings.debugLog.split(' ');
        let currentProgress;

        for (let i = 0; i < temp.length; i++) {
          if (temp[i].indexOf('Progress=') > -1) {
            currentProgress = Number(temp[i].replace('Progress=', '')) * 100;
          }
        }

        return (
          `: ${currentProgress}% (${ translate('INDEX.RESCAN_SM') })`
        );
      } else if (
          this.props.Settings.debugLog.indexOf('LoadExternalBlockFile:') > -1 ||
          this.props.Settings.debugLog.indexOf('Reindexing block file') > -1 
        ) {
        return (
          `: ({ translate('INDEX.REINDEX') })`
        );
      } else {
        return (
          <span> ({ translate('INDEX.DL_BLOCKS') })</span>
        );
      }
    }
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        (this.isFullMode() || this.isNativeMode())) {
      if (this.props.Dashboard.progress &&
          this.props.Dashboard.progress.error) {
        return CoinIsBusyRender.call(this);
      }

      return WalletsProgressRender.call(this);
    }

    return null;
  }
}

export default WalletsProgress;
