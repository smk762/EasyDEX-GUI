import React from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../translate/translate';
import {
  SyncErrorBlocksRender,
  SyncPercentageRender,
  LoadingBlocksRender,
  TranslationComponentsRender,
  CoinIsBusyRender,
  ChainActivationNotificationRender,
  WalletsProgressRender
} from './walletsProgress.render';

class WalletsProgress extends React.Component {
  constructor() {
    super();
    this.state = {
      prevProgress: {},
    };
    this.isFullySynced = this.isFullySynced.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.ActiveCoin &&
        props.ActiveCoin.progress &&
        Number(props.ActiveCoin.progress.longestchain) === 0) {
      let _progress = props.ActiveCoin.progress;

      if (this.state.prevProgress &&
          this.state.prevProgress.longestchain &&
          Number(this.state.prevProgress.longestchain) > 0) {
        _progress.longestchain = this.state.prevProgress.longestchain;
      }
      this.setState(Object.assign({}, this.state, {
        prevProgress: _progress,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        prevProgress: props.ActiveCoin.progress,
      }));
    }
  }

  isFullySynced() {
    const _progress = this.props.ActiveCoin.progress;

    if ((Number(_progress.balances) +
        Number(_progress.validated) +
        Number(_progress.bundles) +
        Number(_progress.utxo)) / 4 === 100) {
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
    const _progress = this.props.ActiveCoin.progress;

    if (_progress) {
      if ((!_progress.blocks && !_progress.longestchain) ||
          (_progress.blocks < _progress.longestchain) ||
          this.props.ActiveCoin.rescanInProgress) {
        return ChainActivationNotificationRender.call(this);
      }
    } else {
      if (this.props.ActiveCoin.rescanInProgress) {
        return ChainActivationNotificationRender.call(this);
      } else {
        return null;
      }
    }
  }

  parseActivatingBestChainProgress() {
    let _debugLogLine;

    if (this.props.Settings.debugLog.indexOf('\n') > -1) {
      const _debugLogMulti = this.props.Settings.debugLog.split('\n');

      for (let i = 0; i < _debugLogMulti.length; i++) {
        if (_debugLogMulti[i].indexOf('progress=') > -1) {
          _debugLogLine = _debugLogMulti[i];
        }
      }
    } else {
      _debugLogLine = this.props.Settings.debugLog;
    }

    if (_debugLogLine) {
      const temp = _debugLogLine.split(' ');
      let currentBestChain;
      let currentProgress;

      for (let i = 0; i < temp.length; i++) {
        if (temp[i].indexOf('height=') > -1) {
          currentBestChain = temp[i].replace('height=', '');
        }
        if (temp[i].indexOf('progress=') > -1) {
          currentProgress = Number(temp[i].replace('progress=', '')) * 1000;
          currentProgress = currentProgress >= 100 ? 100 : currentProgress;
        }
      }

      return [
        currentBestChain,
        currentProgress
      ];
    }
  }

  renderSyncPercentagePlaceholder() {
    const _progress = this.props.ActiveCoin.progress;
    console.warn('renderSyncPercentagePlaceholder', _progress);

    // activating best chain
    if (_progress &&
        _progress.code &&
        _progress.code === -28 &&
        this.props.Settings.debugLog) {
      const _parseProgress = this.parseActivatingBestChainProgress();

      if (_parseProgress &&
          _parseProgress[1]) {
        return SyncPercentageRender.call(this, _parseProgress[1] === 1000 ? 100 : _parseProgress[1].toFixed(2));
      } else {
        return LoadingBlocksRender.call(this);
      }
    }

    if (_progress &&
        _progress.blocks === 0) {
      return SyncErrorBlocksRender.call(this);
    }

    if (_progress &&
        _progress.blocks) {
      const syncPercentage = (parseFloat(parseInt(_progress.blocks, 10) * 100 / parseInt(Number(_progress.longestchain) || Number(this.state.prevProgress.longestchain), 10)).toFixed(2) + '%').replace('NaN', 0);
      return SyncPercentageRender.call(this, syncPercentage === 1000 ? 100 : syncPercentage);
    }

    return LoadingBlocksRender.call(this);
  }

  renderLB(translationID) {
    return TranslationComponentsRender.call(this, translationID);
  }

  renderRescanProgress() {
    if (this.props.Settings.debugLog.indexOf('Still rescanning') > -1 &&
        this.props.ActiveCoin.rescanInProgress) {
      const temp = this.props.Settings.debugLog.split(' ');
      let currentProgress;

      for (let i = 0; i < temp.length; i++) {
        if (temp[i].indexOf('Progress=') > -1) {
          currentProgress = Number(temp[i].replace('Progress=', '')) * 100;
        }
      }

      return currentProgress;
    } else {
      return null;
    }
  }

  renderActivatingBestChainProgress() {
    if (this.props.Settings &&
        this.props.Settings.debugLog &&
        !this.props.ActiveCoin.rescanInProgress) {
      if (this.props.Settings.debugLog.indexOf('UpdateTip') > -1 &&
          !this.props.ActiveCoin.progress &&
          !this.props.ActiveCoin.progress.blocks) {
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
        if (this.props.ActiveCoin.progress.remoteKMDNode &&
            !this.props.ActiveCoin.progress.remoteKMDNode.blocks) {
          return (
            `: ${currentProgress}% (${ translate('INDEX.ACTIVATING_SM') })`
          );
        } else {
          if (this.props.ActiveCoin.progress.remoteKMDNode &&
              this.props.ActiveCoin.progress.remoteKMDNode.blocks) {
            return(
              `: ${Math.floor(currentBestChain * 100 / this.props.ActiveCoin.progress.remoteKMDNode.blocks)}% (${ translate('INDEX.BLOCKS_SM') } ${currentBestChain} / ${this.props.ActiveCoin.progress.remoteKMDNode.blocks})`
            );
          }
        }
      } else if (
          this.props.Settings.debugLog.indexOf('Still rescanning') > -1 &&
          !this.props.ActiveCoin.progress ||
          !this.props.ActiveCoin.progress.blocks
        ) {
        const temp = this.props.Settings.debugLog.split(' ');
        let currentProgress;

        for (let i = 0; i < temp.length; i++) {
          if (temp[i].indexOf('Progress=') > -1) {
            currentProgress = Number(temp[i].replace('Progress=', '')) * 100;
          }
        }

        // activating best chain
        if (this.props.ActiveCoin.progress &&
            this.props.ActiveCoin.progress.code &&
            this.props.ActiveCoin.progress.code === -28 &&
            this.props.Settings.debugLog) {
          const _blocks = this.parseActivatingBestChainProgress();

          if (_blocks &&
              _blocks[0]) {
            return (
              `: ${_blocks[0]} (current block)`
            );
          } else {
            return null;
          }
        } else {
          if (currentProgress) {
            return (
              `: ${currentProgress.toFixed(2)}% (${ translate('INDEX.RESCAN_SM') })`
            );
          } else {
            return null;
          }
        }
      } else if (this.props.Settings.debugLog.indexOf('Rescanning last') > -1) {
        return (
          `: (${ translate('INDEX.RESCANNING_LAST_BLOCKS') })`
        );
      } else if (
          this.props.Settings.debugLog.indexOf('LoadExternalBlockFile:') > -1 ||
          this.props.Settings.debugLog.indexOf('Reindexing block file') > -1
        ) {
        return (
          `: (${ translate('INDEX.REINDEX') })`
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
      if (this.props.ActiveCoin.progress &&
          this.props.ActiveCoin.progress.error) {
        return CoinIsBusyRender.call(this);
      }

      return WalletsProgressRender.call(this);
    }

    return null;
  }
}
const mapStateToProps = (state) => {
  return {
    Dashboard: state.Dashboard,
    Settings: {
      debugLog: state.Settings.debugLog,
    },
    ActiveCoin: {
      mode: state.ActiveCoin.mode,
      coin: state.ActiveCoin.coin,
      progress: state.ActiveCoin.progress,
      rescanInProgress: state.ActiveCoin.rescanInProgress,
    },
  };
};

export default connect(mapStateToProps)(WalletsProgress);