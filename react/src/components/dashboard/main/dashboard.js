import React from 'react';
import { connect } from 'react-redux';
import DashboardRender from './dashboard.render';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
    };
    this.renderDashboard = this.renderDashboard.bind(this);
  }

  isSectionActive(section) {
    return this.props.Dashboard.activeSection === section;
  }

  renderDashboard() {
    document.body.className = '';

    return DashboardRender.call(this);
  }

  isLoggedIn() {
    return this.props &&
      this.props.Main &&
      this.props.Main.isLoggedIn;
  }

  isNativeMode() {
    return this.props.ActiveCoin.mode === 'native';
  }

  render() {
    if (this.isLoggedIn()) {
      return this.renderDashboard();
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    ActiveCoin: {
      mode: state.ActiveCoin.mode,
    },
    Dashboard: {
      activeSection: state.Dashboard.activeSection,
    },
  };
};

export default connect(mapStateToProps)(Dashboard);
