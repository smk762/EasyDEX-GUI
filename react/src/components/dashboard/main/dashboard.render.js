import React from 'react';

import Navbar from '../navbar/navbar';
import CoinTile from '../coinTile/coinTile';
import EDEX from '../edex/edex';
import WalletsBalance from '../walletsBalance/walletsBalance';
import WalletsProgress from '../walletsProgress/walletsProgress';
import WalletsNav from '../walletsNav/walletsNav';
import SendCoin from '../sendCoin/sendCoin';
import WalletsData from '../walletsData/walletsData';
import Atomic from '../atomic/atomic';
import Jumblr from '../jumblr/jumblr';
import Settings from '../settings/settings';
import ReceiveCoin from '../receiveCoin/receiveCoin';
import About from '../about/about';
import WalletsNative from '../walletsNative/walletsNative';
import WalletsTxInfo from '../walletsTxInfo/walletsTxInfo';
import CoindDownModal from '../coindDownModal/coindDownModal';

const DashboardRender = function() {
  return (
    <div className="full-height">
      <div
        className={ this.isSectionActive('wallets') ? 'page-main' : '' }
        id="section-dashboard">
        <Navbar />
        <CoindDownModal />
        <div className={ this.isSectionActive('wallets') ? 'show' : 'hide' }>
          <CoinTile />
          <WalletsNav />
          { !this.isNativeMode() && <WalletsProgress /> }
          { !this.isNativeMode() && <WalletsBalance />}
          <SendCoin />
          { !this.isNativeMode() && <ReceiveCoin /> }
          { !this.isNativeMode() && <WalletsData /> }
          <WalletsTxInfo />
          <WalletsNative />
        </div>
        { this.isSectionActive('edex') &&
          <EDEX />
        }
        { this.isSectionActive('atomic') &&
          <Atomic {...this.props} />
        }
        { this.isSectionActive('jumblr') &&
          <Jumblr {...this.props} />
        }
        { this.isSectionActive('settings') &&
          <Settings {...this.props} />
        }
        { this.isSectionActive('about') &&
          <About {...this.props} />
        }
      </div>
    </div>
  );
};

export default DashboardRender;