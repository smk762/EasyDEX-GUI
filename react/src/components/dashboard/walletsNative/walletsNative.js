import React from 'react';
import { connect } from 'react-redux';
import WalletsNativeRender from './walletsNative.render';
import { translate } from '../../../translate/translate';
import { triggerToaster } from '../../../actions/actionCreators';
import { getCoinTitle } from '../../../util/coinHelper';
import Config from '../../../config';
import Store from '../../../store';

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

const socket = io.connect(`http://127.0.0.1:${Config.agamaPort}`);

class WalletsNative extends React.Component {
  constructor() {
    super();
    this.state = {
      nativeOnly: Config.iguanaLessMode,
    };
    this.getCoinStyle = this.getCoinStyle.bind(this);
    socket.on('service', msg => this.updateSocketsData(msg));
  }

  updateSocketsData(data) {
    if (data &&
        data.komodod &&
        data.komodod.error) {
      switch (data.komodod.error) {
        case 'run -reindex':
          Store.dispatch(
            triggerToaster(
              translate('TOASTR.RESTART_AGAMA_WITH_REINDEX_PARAM'),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'info',
              false
            )
          );
          break;
      }
    }
  }

  getCoinStyle(type) {
    if (type === 'transparent') {
      if (getCoinTitle(this.props.ActiveCoin.coin).transparentBG && getCoinTitle().logo) {
        return { 'backgroundImage': `url("assets/images/bg/${getCoinTitle().logo.toLowerCase()}_transparent_header_bg.png")` };
      }
    } else if (type === 'title') {
      let _iconPath;

      if (getCoinTitle(this.props.ActiveCoin.coin).titleBG) {
        _iconPath = `assets/images/native/${getCoinTitle(this.props.ActiveCoin.coin).logo.toLowerCase()}_header_title_logo.png`;
      } else if (!getCoinTitle(this.props.ActiveCoin.coin).titleBG && getCoinTitle(this.props.ActiveCoin.coin).logo) {
        _iconPath = `assets/images/cryptologo/${getCoinTitle(this.props.ActiveCoin.coin).logo.toLowerCase()}.png`;
      }

      return _iconPath;
    }
  }

  isActiveCoinModeNative() {
    return this.props &&
      this.props.ActiveCoin &&
      this.props.ActiveCoin.mode === 'native';
  }

  render() {
    if (this.isActiveCoinModeNative()) {
      return WalletsNativeRender.call(this);
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
      mode: state.ActiveCoin.mode,
    }
  };

};

export default connect(mapStateToProps)(WalletsNative);
