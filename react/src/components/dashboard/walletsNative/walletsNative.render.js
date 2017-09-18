import React from 'react';
import WalletsBalance from '../walletsBalance/walletsBalance';
import WalletsInfo from '../walletsInfo/walletsInfo';
import WalletsNativeSend from '../walletsNativeSend/walletsNativeSend';
import WalletsProgress from '../walletsProgress/walletsProgress';
import WalletsData from '../walletsData/walletsData';
import ReceiveCoin from '../receiveCoin/receiveCoin';

const WalletsNativeRender = function() {
  return (
    <div className="page margin-left-0">
      <div className="padding-top-0">
        <div
          id="easydex-header-div"
          className="background-color-white"
          style={ this.getCoinStyle('transparent') }>
          <ol className={ 'coin-logo ' + (!this.state.nativeOnly ? 'breadcrumb breadcrumb--normal' : 'breadcrumb') + (this.props.ActiveCoin.coin === 'KMD' || this.props.ActiveCoin.coin === 'JUMBLR' || this.props.ActiveCoin.coin === 'MESH' || this.props.ActiveCoin.coin === 'MVP' ? ' coin-logo-wide' : '') + (this.state.nativeOnly ? ' native-coin-logo' : '') }>
            <li className="header-easydex-section">
              { this.getCoinStyle('title') &&
                <img src={ this.getCoinStyle('title') } />
              }
              <span
                className={ `easydex-section-image ${(this.props.ActiveCoin.coin === 'KMD' || this.props.ActiveCoin.coin === 'JUMBLR' || this.props.ActiveCoin.coin === 'MESH' || this.props.ActiveCoin.coin === 'MVP' ? 'hide' : '')}` }
                style={{ marginLeft: '20px' }}>
                { this.props.ActiveCoin.coin }
              </span>
            </li>
          </ol>
        </div>
        <div className={ 'page-content' + (this.state.nativeOnly ? ' page-content-native' : '') }>
          <WalletsProgress />
          <div className="row">
            <WalletsBalance />
            <ReceiveCoin />
            <WalletsData />
            <WalletsNativeSend />
            <WalletsInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsNativeRender;