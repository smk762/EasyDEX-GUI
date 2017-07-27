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
          style={{ 'backgroundImage': `url("assets/images/bg/${this.defaultBG()}_transparent_header_bg.png")` }}>
          <ol className="breadcrumb">
            <li className="header-easydex-section">
              <img src={ `assets/images/native/${this.defaultBG()}_header_title_logo.png` } /> 
              <span
                className={ `easydex-section-image ${(this.props.ActiveCoin.coin === 'KMD' ? 'hide' : '')}` }
                style={{ marginLeft: '20px' }}>
                { this.props.ActiveCoin.coin }
              </span>
            </li>
          </ol>
        </div>
        <div className="page-content">
          <WalletsProgress {...this.props} />
          <div className="row">
            <WalletsBalance {...this.props} />
            <ReceiveCoin {...this.props.ActiveCoin} />
            <WalletsData {...this.props} />
            <WalletsNativeSend {...this.props} />
            <WalletsInfo {...this.props} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsNativeRender;