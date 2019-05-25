import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import {
  getAppConfig,
  getAppInfo,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import { SettingsRender } from './settings.render';
import mainWindow from '../../../util/mainWindow';

/*
  TODO: batch export/import wallet addresses
*/
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.displaySPVServerListTab = this.displaySPVServerListTab.bind(this);
  }

  displaySPVServerListTab() {
    const _coins = this.props.Main.coins;
    const _electrumCoins = this.props.Dashboard.electrumCoins;

    if (this.props.Main &&
        _coins &&
        _coins.spv) {
      for (let i = 0; i < _coins.spv.length; i++) {
        if (_electrumCoins[_coins.spv[i]] &&
            _electrumCoins[_coins.spv[i]].serverList) {
          return true;
        }
      }
    }
  }

  componentDidMount(props) {
    Store.dispatch(getAppConfig());
    Store.dispatch(getAppInfo());

    document.getElementById('section-iguana-wallet-settings').setAttribute('style', 'height:auto; min-height: 100%');
  }

  render() {
    return SettingsRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    Main: state.Main,
    Dashboard: state.Dashboard,
    Login: state.Login,
  };
};

export default connect(mapStateToProps)(Settings);