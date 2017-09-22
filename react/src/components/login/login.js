import React from 'react';
import { connect } from 'react-redux';
import {
  toggleAddcoinModal,
  startInterval,
  getDexCoins,
  triggerToaster,
  toggleLoginSettingsModal
} from '../../actions/actionCreators';
import Config from '../../config';
import Store from '../../store';
import { PassPhraseGenerator } from '../../util/crypto/passphrasegenerator';
import LoginRender from './login.render';
import { translate } from '../../translate/translate';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      display: false,
      activeLoginSection: 'activateCoin',
      displayLoginSettingsDropdown: false,
      displayLoginSettingsDropdownSection: null,
    };
    this.toggleActivateCoinForm = this.toggleActivateCoinForm.bind(this);
    this.toggleLoginSettingsDropdown = this.toggleLoginSettingsDropdown.bind(this);
  }

  // the setInterval handler for 'activeCoins'
  _iguanaActiveCoins = null;

  toggleLoginSettingsDropdownSection(sectionName) {
    Store.dispatch(toggleLoginSettingsModal(true));

    this.setState({
      displayLoginSettingsDropdown: false,
      displayLoginSettingsDropdownSection: sectionName,
    });
  }

  componentWillReceiveProps(props) {
    if (props &&
        props.Main &&
        props.Main.coins &&
        props.Main.coins.native &&
        props.Main.coins.native.length) {
      this.setState({
        display: false,
      });
    } else {
      this.setState({
        display: true,
      });
    }
  }

  toggleLoginSettingsDropdown() {
    this.setState(Object.assign({}, this.state, {
      displayLoginSettingsDropdown: !this.state.displayLoginSettingsDropdown,
    }));
  }

  toggleActivateCoinForm() {
    Store.dispatch(toggleAddcoinModal(true, false));
  }

  updateActiveLoginSection(name) {
    this.setState({
      activeLoginSection: name,
   });
  }

  render() {
    if ((this.state && this.state.display) ||
        !this.props.Main) {
      return LoginRender.call(this);
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    Dashboard: {
      activeHandle: state.Dashboard.activeHandle,
    },
    Interval: {
      interval: state.Interval.interval,
    },
    Login: state.Login,
  };
};

export default connect(mapStateToProps)(Login);
