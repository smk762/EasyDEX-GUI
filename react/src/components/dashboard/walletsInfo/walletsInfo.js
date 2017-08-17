import React from 'react';
import WalletsNativeInfoRender from './walletsInfo.render';
import { toggleClaimInterestModal } from '../../../actions/actionCreators';
import Store from '../../../store';

class WalletsNativeInfo extends React.Component {
  constructor(props) {
    super(props);
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

export default WalletsNativeInfo;
