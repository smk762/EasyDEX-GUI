import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardChangeSection,
  toggleAddcoinModal,
  stopInterval,
  startInterval,
  toggleSyncOnlyModal,
  getSyncOnlyForks,
  logout,
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
      nativeOnly: Config.iguanaLessMode,
    };
    this.openDropMenu = this.openDropMenu.bind(this);
    this.logout = this.logout.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this._checkAC = this._checkAC.bind(this);
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );
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

  logout() {
    Store.dispatch(
      stopInterval(
        'sync',
        this.props.Interval.interval
      )
    );
    Store.dispatch(
      stopInterval(
        'basilisk',
        this.props.Interval.interval
      )
    );
    Store.dispatch(logout());
    location.reload();
  }

  openSyncOnlyModal() {
    Store.dispatch(getSyncOnlyForks());

    const _iguanaActiveHandle = setInterval(() => {
      Store.dispatch(getSyncOnlyForks());
    }, 3000);
    Store.dispatch(
      startInterval(
        'syncOnly',
        _iguanaActiveHandle
      )
    );

    Store.dispatch(toggleSyncOnlyModal(true));
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
    nativeOnly: Config.iguanaLessMode,
  };
};

export default connect(mapStateToProps)(Navbar);

