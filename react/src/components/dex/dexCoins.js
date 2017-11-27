import React from 'react';
import { translate } from '../../translate/translate';

class DexCoins extends React.Component {
  constructor() {
    super();
    this.state = {
      isNewPassphrase: false,
    };
  }

  render() {
    return (
      <section className="dashboard">
        <section className="dashboard-wallets">
          <header className="dashboard-wallets-header component-header">
            <i className="dashboard-empty-logo">
              <svg viewBox="0 0 800.000000 600.000000" preserveAspectRatio="xMidYMid meet">
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
            <div className="recharts-responsive-container dashboard-balances-pie" style={{ width: '250px', height: '450px' }}>
            { /* portfolio chart here */ }
            </div>
            <h1>
              <label>Estimated balance</label>
              <span>0.00345625 BTC</span>
              <small>$32.21</small>
            </h1>
            <button className="action dark">
              <span>swap history</span>
              <i>
                <svg id="Layer_1" style={{ enableBackground: 'new 0 0 30 30' }} version="1.1" viewBox="0 0 30 30">
                  <path d="M16.414,13.586c0.781,0.781,0.781,2.047,0,2.828c-0.781,0.781-2.047,0.781-2.828,0c-0.544-0.544-3.044-4.418-4.508-6.715 C8.818,9.292,9.292,8.818,9.699,9.078C11.996,10.542,15.87,13.041,16.414,13.586z"></path>
                  <path d="M6.58,7.93 C4.971,9.841,4,12.306,4,15c0,6.075,4.925,11,11,11s11-4.925,11-11S21.075,4,15,4v4" style={{ fill: 'none', stroke: '#CCC', strokeWidth: '2', strokeLinecap: 'round', strokeMiterlimit: '10' }}></path>
                </svg>
              </i>
            </button>
          </header>
          <ul className="dashboard-wallets-list">
            <li className="coinList-coin MNZ">
              <a className="MNZ" href="#/wallet/MNZ/false">
                <div className="coinList-coin_icon coin-colorized">
                  <i className="coin-icon-svg MNZ">
                    <svg version="1.1" id="Calque_1" x="0px" y="0px" viewBox="0 0 50 50" style={{ enableBackground: 'new 0 0 148 50' }}>
                      <g>
                        <path className="st1" d="M15.9,17.9"></path>
                        <path d="M39.9,34.5c-0.2-1.2-0.6-2.4-0.9-3.5c-0.3-1.2-0.6-2.4-0.9-3.6c-0.8-3-1.6-6-2.4-9c-0.2-0.7-0.3-1.4-0.5-2.1 c-0.1-0.3-0.2-0.7-0.5-0.9c-0.3-0.1-0.6-0.1-0.9-0.1c-0.4,0-0.8,0-1.2,0c-0.8,0-1.7,0-2.5,0c-0.6,0-1.1,0-1.7,0.1 c-0.5,0.1-1,0.4-1.2,0.9c-0.1,0.2,0,0.5,0.2,0.6c0.1,0.1,0.3,0,0.4-0.1c0.1,0,0.4-0.3,0.5-0.3l4.7,17.3l0,0c0,0,0,0.1,0,0.1 c0.1,0.4,0.3,0.8,0.6,0.9c0.2,0.1,0.4,0.2,0.7,0.2h0.5h0.8h2.4h1.3C39.6,35.1,40,34.9,39.9,34.5z"></path>
                        <path d="M28.3,34.5c-0.2-1.2-0.6-2.4-0.9-3.5c-0.3-1.2-0.6-2.4-0.9-3.6c-0.8-3-1.6-6-2.4-9c-0.2-0.7-0.3-1.4-0.5-2.1 c-0.1-0.3-0.2-0.7-0.5-0.9c-0.3-0.1-0.6-0.1-0.9-0.1c-0.4,0-0.8,0-1.2,0c-0.8,0-1.7,0-2.5,0c-0.6,0-1.1,0-1.7,0.1 c-0.5,0.1-1,0.4-1.2,0.9c-0.1,0.2,0,0.5,0.2,0.6c0.1,0.1,0.3,0,0.4-0.1c0.1,0,0.4-0.3,0.5-0.3l4.7,17.3l0,0c0,0,0,0.1,0,0.1 c0.1,0.4,0.3,0.8,0.6,0.9c0.2,0.1,0.4,0.2,0.7,0.2h0.5h0.8h2.4h1.3C28,35.1,28.4,34.9,28.3,34.5z"></path>
                        <path d="M19.1,30.7l-3.2-12.5h0c0-0.2-0.2-0.4-0.5-0.4c-0.2,0-0.4,0.2-0.5,0.4l0,0L10.7,34l0,0c0,0.1,0,0.2,0,0.2 c0,0.5,0.4,1,1,1H17c0.4,0,0.8-0.3,0.9-0.7l0,0L19.1,30.7z"></path>
                        <path d="M30.9,30.4l-3.5-12.6h0c0-0.2-0.2-0.3-0.4-0.3c-0.2,0-0.4,0.1-0.4,0.3h0l-0.7,2.5l3.5,12.2l0,0l0,0 c0.1,0.2,0.2,0.3,0.4,0.3c0.2,0,0.3-0.1,0.4-0.3l0,0L30.9,30.4z"></path>
                      </g>
                    </svg>
                  </i>
                </div>
                <div className="coinList-coin_balance MNZ">
                  <strong className="coinList-coin_balance-name">Monaize</strong>
                  <strong className="coinList-coin_balance-amount">
                    20.35808051 MNZ
                  </strong>
                  <small>Electrum mode</small>
                </div>
                <span className="coinList-coin_action">
                  <svg id="Layer_1" style={{ enableBackground: 'new 0 0 512 512' }} version="1.1" viewBox="0 0 512 512">
                    <polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "></polygon>
                  </svg>
                </span>
                { /* toggle opacity */}
                <span className="coinList-coin_action_loader">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-flickr" style={{ background: 'none' }}>
                    <circle ng-attr-cx="{{config.cx1}}" cy="50" ng-attr-fill="{{config.c1}}" ng-attr-r="{{config.radius}}" cx="54.6667" fill="#FFF" r="20">
                      <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="2" begin="-1s" repeatCount="indefinite"></animate>
                    </circle>
                    <circle ng-attr-cx="{{config.cx2}}" cy="50" ng-attr-fill="{{config.c2}}" ng-attr-r="{{config.radius}}" cx="45.3333" fill="#000" r="20">
                      <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="2" begin="0s" repeatCount="indefinite"></animate>
                    </circle>
                    <circle ng-attr-cx="{{config.cx1}}" cy="50" ng-attr-fill="{{config.c1}}" ng-attr-r="{{config.radius}}" cx="54.6667" fill="#FFF" r="20">
                      <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="2" begin="-1s" repeatCount="indefinite"></animate>
                      <animate attributeName="fill-opacity" values="0;0;1;1" calcMode="discrete" keyTimes="0;0.499;0.5;1" ng-attr-dur="{{config.speed}}s" repeatCount="indefinite" dur="2s"></animate>
                    </circle>
                  </svg>
                </span>
              </a>
            </li>
          </ul>
        </section>
      </section>
    );
  }
}

export default DexCoins;