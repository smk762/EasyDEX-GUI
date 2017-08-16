import React from 'react';
import { connect } from 'react-redux';
import WalletsNativeInfoRender from './walletsInfo.render';
import { toggleClaimInterestModal } from '../../../actions/actionCreators';
import Store from '../../../store';

class WalletsNativeInfo extends React.Component {
  constructor() {
    super();
    this.openClaimInterestModal = this.openClaimInterestModal.bind(this);
  }

  openClaimInterestModal() {
    Store.dispatch(toggleClaimInterestModal(true));
  }

  render() {
    if (this.props &&
        this.props.Dashboard &&
        this.props.Dashboard.progress &&
        this.props.ActiveCoin.activeSection === 'settings') {
      return WalletsNativeInfoRender.call(this);
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
      activeSection: state.ActiveCoin.activeSection,
    },
    Dashboard: {
      progress: state.Dashboard.progress
    }
  };
 
};

export default connect(mapStateToProps)(WalletsNativeInfo);
