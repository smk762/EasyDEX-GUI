import React from 'react';
import { connect } from 'react-redux';
import { toggleCoindDownModal } from '../../../actions/actionCreators';
import Store from '../../../store';

import CoindDownModalRender from './coindDownModal.render';

class CoindDownModal extends React.Component {
  constructor() {
    super();
    this.state = {
      display: false,
      debugLogCrash: null,
    };
    this.dismiss = this.dismiss.bind(this);
  }

  dismiss() {
    Store.dispatch(toggleCoindDownModal(false));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.displayCoindDownModal !== nextProps.displayCoindDownModal) {
      this.setState(Object.assign({}, this.state, {
        display: nextProps.displayCoindDownModal,
      }));
    }
  }

  render() {
    if (this.state.display) {
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
    },
    displayCoindDownModal: state.Dashboard.displayCoindDownModal,
    debugLog: state.Settings.debugLog,
  };
};

export default connect(mapStateToProps)(CoindDownModal);
