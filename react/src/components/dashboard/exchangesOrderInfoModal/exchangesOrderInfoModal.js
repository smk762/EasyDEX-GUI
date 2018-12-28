import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import {
  toggleExchangesOrderInfoModal,
  getTxDetails,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import ExchangesOrderInfoModalRender from './exchangesOrderInfoModal.render';
import Config from '../../../config';

class ExchangesOrderInfoModal extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 0,
      className: 'hide',
    };
    this._toggleExchangesOrderInfoModal = this._toggleExchangesOrderInfoModal.bind(this);
  }

  _toggleExchangesOrderInfoModal() {
    this.setState(Object.assign({}, this.state, {
      className: 'show out',
    }));

    setTimeout(() => {
      Store.dispatch(toggleExchangesOrderInfoModal(null));

      this.setState(Object.assign({}, this.state, {
        activeTab: 0,
      }));
    }, 300);
  }

  componentWillReceiveProps(nextProps) {
    const _dashboard = nextProps.Dashboard;

    if (this.props.Dashboard.showExchangesOrderInfoId !== _dashboard.showExchangesOrderInfoId) {
      this.setState(Object.assign({}, this.state, {
        className: _dashboard.showExchangesOrderInfoId ? 'show fade' : 'show out',
      }));

      setTimeout(() => {
        this.setState(Object.assign({}, this.state, {
          activeTab: 0,
          className: _dashboard.showExchangesOrderInfoId ? 'show in' : 'hide',
        }));
      }, _dashboard.showExchangesOrderInfoId ? 50 : 300);
    }
  }

  openTab(tab) {
    this.setState(Object.assign({}, this.state, {
      activeTab: tab,
    }));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this._toggleExchangesOrderInfoModal();
    }
  }

  render() {
    return ExchangesOrderInfoModalRender.call(this);
  }
}

const mapStateToProps = (state, props) => {
  return {
    Dashboard: state.Dashboard,
    provider: props.provider,
  };
};

export default connect(mapStateToProps)(ExchangesOrderInfoModal);