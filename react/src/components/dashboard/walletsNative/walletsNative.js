import React from 'react';
import WalletsNativeRender from './walletsNative.render';
import { translate } from '../../../translate/translate';
import { triggerToaster } from '../../../actions/actionCreators';
import Config from '../../../config';
import Store from '../../../store';

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

const socket = io.connect(`http://127.0.0.1:${Config.agamaPort}`);

class WalletsNative extends React.Component {
  constructor(props) {
    super(props);
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
                'Restart Agama and run Komodo with -reindex param',
                translate('TOASTR.WALLET_NOTIFICATION'),
                'info',
                false
              )
            );
            break;
        }
    }
  }

  defaultBG() {
    if (this.props.ActiveCoin.coin === 'REVS') {
      return 'supernet';
    } else {
      return this.props.ActiveCoin.coin.toLowerCase();
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

export default WalletsNative;
