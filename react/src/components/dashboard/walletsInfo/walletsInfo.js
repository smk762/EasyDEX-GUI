import React from 'react';
import WalletsNativeInfoRender from './walletsInfo.render';

class WalletsNativeInfo extends React.Component {
  constructor(props) {
    super(props);
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
