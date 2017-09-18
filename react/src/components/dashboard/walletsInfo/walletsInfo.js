import React from 'react';
import { connect } from 'react-redux';
import WalletsNativeInfoRender from './walletsInfo.render';
import { toggleClaimInterestModal } from '../../../actions/actionCreators';
import Store from '../../../store';

class WalletsInfo extends React.Component {
  constructor() {
    super();
    this.openClaimInterestModal = this.openClaimInterestModal.bind(this);
  }

  openClaimInterestModal() {
    Store.dispatch(toggleClaimInterestModal(true));
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.progress &&
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
      progress: state.ActiveCoin.progress,
    },
  };
};

export default connect(mapStateToProps)(WalletsInfo);
