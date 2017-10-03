import React from 'react';

import Navbar from '../navbar/navbar';
import CoinTile from '../coinTile/coinTile';
import EDEX from '../edex/edex';
import WalletsBalance from '../walletsBalance/walletsBalance';
import WalletsProgress from '../walletsProgress/walletsProgress';
import WalletsNav from '../walletsNav/walletsNav';
import SendCoin from '../sendCoin/sendCoin';
import WalletsData from '../walletsData/walletsData';
import Jumblr from '../jumblr/jumblr';
import Settings from '../settings/settings';
import ReceiveCoin from '../receiveCoin/receiveCoin';
import About from '../about/about';
import WalletsNative from '../walletsNative/walletsNative';
import WalletsTxInfo from '../walletsTxInfo/walletsTxInfo';
import CoindDownModal from '../coindDownModal/coindDownModal';
import ImportKeyModal from '../importKeyModal/importKeyModal';

const DashboardRender = function() {
  return (
    <div className="full-height">
      <div
        className={ this.isSectionActive('wallets') ? 'page-main' : '' }
        id="section-dashboard">
        <Navbar />
        <CoindDownModal />
        { this.props.Dashboard.displayImportKeyModal &&
          <ImportKeyModal />
        }
        <div className={ this.isSectionActive('wallets') ? 'show' : 'hide' }>
          <CoinTile />
          <WalletsNav />
          <WalletsTxInfo />
          <WalletsNative />
        </div>
        { this.isSectionActive('edex') &&
          <EDEX />
        }
        { this.isSectionActive('jumblr') &&
          <Jumblr  />
        }
        { this.isSectionActive('settings') &&
          <Settings disableWalletSpecificUI={false} />
        }
        { this.isSectionActive('about') &&
          <About />
        }
      </div>
    </div>
  );
};

export default DashboardRender;