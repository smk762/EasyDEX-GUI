import React from 'react';
import { connect } from 'react-redux';
import Toaster from '../toaster/toaster';
import AddCoin from '../addcoin/addcoin';
import Login from '../login/login';
import Dashboard from '../dashboard/main/dashboard';
import DexMain from '../dex/dexMain';

class WalletMain extends React.Component {
  render() {
    return (
      <div className="full-height">
        <input
          type="text"
          id="js-copytextarea" />
        <Dashboard />
        { /*
        <DexMain />
        */
        }
        <AddCoin />
        <Login />
        <Toaster {...this.props.toaster} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    toaster: state.toaster,
  };
};

export default connect(mapStateToProps)(WalletMain);

