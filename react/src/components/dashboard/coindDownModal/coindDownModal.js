import React from 'react';
import { connect } from 'react-redux';
import { toggleCoindDownModal } from '../../../actions/actionCreators';
import Store from '../../../store';

import CoindDownModalRender from './coindDownModal.render';

const COIND_DOWN_MODAL_FETCH_FAILURES_THRESHOLD = window.require('electron').remote.getCurrentWindow().appConfig.failedRPCAttemptsThreshold || 10;

class CoindDownModal extends React.Component {
  constructor() {
    super();
    this.state = {
      display: false,
      debugLogCrash: null,
      kmdMainPassiveMode: false,
    };
    this.dismiss = this.dismiss.bind(this);
  }

  dismiss() {
    Store.dispatch(toggleCoindDownModal(false));
  }

  componentWillMount() {
    let _kmdMainPassiveMode;

    try {
      _kmdMainPassiveMode = window.require('electron').remote.getCurrentWindow().kmdMainPassiveMode;
    } catch (e) {}

    this.setState(Object.assign({}, this.state, {
      kmdMainPassiveMode: _kmdMainPassiveMode,
    }));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.displayCoindDownModal !== nextProps.displayCoindDownModal) {
      this.setState(Object.assign({}, this.state, {
        display: nextProps.displayCoindDownModal,
      }));
    }
  }

  render() {
    if (this.state.display &&
        !this.state.kmdMainPassiveMode &&
        this.props.ActiveCoin.getinfoFetchFailures >= COIND_DOWN_MODAL_FETCH_FAILURES_THRESHOLD) {
      return CoindDownModalRender.call(this);
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      mode: state.ActiveCoin.mode,
      coin: state.ActiveCoin.coin,
      getinfoFetchFailures: state.ActiveCoin.getinfoFetchFailures,
    },
    displayCoindDownModal: state.Dashboard.displayCoindDownModal,
    debugLog: state.Settings.debugLog,
  };
};

export default connect(mapStateToProps)(CoindDownModal);
