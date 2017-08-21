import React from 'react';
import Toaster from '../toaster/toaster';
import AddCoin from '../addcoin/addcoin';
import Login from '../login/login';
import Dashboard from '../dashboard/main/dashboard';
import SyncOnly from '../dashboard/syncOnly/syncOnly';
import Notifications from '../dashboard/notifications/notifications';

class WalletMain extends React.Component {
  render() {
    return (
      <div className="full-height">
        <input type="text" id="js-copytextarea" />
        <SyncOnly />
        <Dashboard />
        <AddCoin />
        <Login />
        <Toaster {...this.props.toaster} />
        <Notifications />
      </div>
    );
  }
}

export default WalletMain;
