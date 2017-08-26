import React from 'react';
import { connect } from 'react-redux';
import { basiliskConnection } from '../../../actions/actionCreators';
import Store from '../../../store';
import WalletsBasiliskConnectionRender from './walletsBasiliskConnection.render';

class WalletsBasiliskConnection extends React.Component {
  constructor() {
    super();
    this.basiliskConnectionAction = this.basiliskConnectionAction.bind(this);
  }

  basiliskConnectionAction() {
    Store.dispatch(basiliskConnection(false));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.basiliskConnectionAction();
    }
  }

  isBasiliskConnection() {
    return this.props &&
      this.props.Dashboard.basiliskConnection;
  }

  render() {
    if (this.isBasiliskConnection()) {
      return WalletsBasiliskConnectionRender.call(this);
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    Dashboard: {
      basiliskConnection: state.Dashboard.basiliskConnection,
      connectedNotaries: state.Dashboard.connectedNotaries,
    }
  };
};

export default connect(mapStateToProps)(WalletsBasiliskConnection);
