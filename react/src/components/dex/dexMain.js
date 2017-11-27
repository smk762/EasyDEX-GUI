import React from 'react';
import { translate } from '../../translate/translate';
import DexNotifier from './dexNotifier';
import DexLogin from './dexLogin';
import DexCoins from './dexCoins';
import DexSwapHistory from './dexSwapHistory';
import DexLoading from './dexLoading';
import DexExchange from './dexExchange';

// TODO: portfolio, charts, extended swaps history

class DexMain extends React.Component {
  constructor() {
    super();
    this.state = {
      isNewPassphrase: false,
    };
  }

  render() {
    return (
      <div className="dex">
        <content className="app content-container">
          <ul className="growler"></ul>
          <header className="window-header">
            <ul>
              <li className="window__title">
                <i className="window-header-logo">
                  <svg version="1.0" viewBox="0 0 800.000000 600.000000" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#9300FF"></stop>
                        <stop offset="49%" stopColor="#5272E2"></stop>
                        <stop offset="95%" stopColor="#4C84FF"></stop>
                      </linearGradient>
                    </defs>
                    <g transform="translate(-100.000000,800.000000) scale(0.100000,-0.100000)" fill="url(#gradient)" stroke="none">
                      <path d="M5310 3550 l0 -120 -38 0 c-56 0 -186 -35 -242 -66 -258 -141 -359 -466 -228 -734 41 -85 151 -196 235 -239 115 -58 268 -77 378 -47 230 61 382 289 346 517 -6 35 -11 67 -11 72 0 4 -63 7 -140 7 l-139 0 24 -46 c32 -60 34 -147 5 -203 -47 -93 -162 -148 -252 -122 -174 51 -230 261 -101 383 59 57 70 58 463 58 l360 0 0 30 c0 52 -30 179 -56 237 -34 78 -104 172 -171 233 -100 89 -274 159 -395 160 l-38 0 0 -120z m334 -154 c76 -32 106 -136 59 -202 -30 -42 -86 -68 -132 -60 -134 21 -162 197 -40 258 41 22 69 22 113 4z"></path>
                    </g>
                  </svg>
                </i>
                <h1>
                  Barter <strong>DEX</strong>
                </h1>
                <small className="window-header-appversion">version 1.3.5</small>
              </li>
              <li className="window__controls_right">
                <button className="action danger">logout</button>
              </li>
            </ul>
          </header>
          <section className="app-view">
            <DexExchange />
            <DexNotifier />
          </section>
          <footer className="window-footer window-footer__visible"></footer>
        </content>
      </div>
    );
  }
}

export default DexMain;