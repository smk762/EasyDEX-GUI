import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardChangeSection,
  toggleAddcoinModal,
  stopInterval,
  startInterval,
  displayImportKeyModal,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import { checkAC } from '../../addcoin/payload';

import NavbarRender from './navbar.render';

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      openDropMenu: false,
      isExperimentalOn: false,
    };
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this._checkAC = this._checkAC.bind(this);
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    let appConfig;

    try {
      appConfig = window.require('electron').remote.getCurrentWindow().appConfig;
    } catch (e) {}

    this.setState({
      isExperimentalOn: appConfig.experimentalFeatures,
    });
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  handleClickOutside(e) {
    if (e.srcElement.className !== 'dropdown-menu' &&
        e.srcElement.alt !== 'iguana profile pic' &&
        (e.srcElement.offsetParent && e.srcElement.offsetParent.className !== 'avatar avatar-online') &&
        e.srcElement.className.indexOf('navbar-avatar') === -1 &&
        (e.path && e.path[4] && e.path[4].className.indexOf('dropdown-menu') === -1)) {
      this.setState({
        openDropMenu: false,
      });
    }
  }

  openImportKeyModal() {
    Store.dispatch(displayImportKeyModal(true));
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      openDropMenu: !this.state.openDropMenu,
    }));
  }

  toggleAddCoinModal() {
    Store.dispatch(toggleAddcoinModal(true, false));
  }

  dashboardChangeSection(sectionName) {
    Store.dispatch(dashboardChangeSection(sectionName));
  }

  _checkAC() {
    return checkAC(this.props.ActiveCoin.coin);
  }

  isSectionActive(section) {
    return this.props.Dashboard.activeSection === section;
  }

  render() {
    return NavbarRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      mode: state.ActiveCoin.mode,
      coin: state.ActiveCoin.coin,
    },
    Dashboard: {
      activeSection: state.Dashboard.activeSection,
    },
    Interval: {
      interval: state.Interval.interval,
    },
  };
};

export default connect(mapStateToProps)(Navbar);
