import React from 'react';
import { translate } from '../../translate/translate';
import SVGFaviconBlack from './svg/faviconBlack';
import SVGMNZ from './svg/mnz';
import DexLoaderSmall from './dexLoaderSmall';
import mainWindow from '../../util/mainWindow';
import * as coinIcon from 'react-cryptocoins';
import Store from '../../store';
import {
  shepherdMMRequest,
} from '../../actions/actionCreators';
import { connect } from 'react-redux';

class DexCoins extends React.Component {
  constructor() {
    super();
    this.state = {
      balance: {
        kmd: 0,
        btc: 0,
      },
      coinLoading: false,
    };
    this.calcTotalBalance = this.calcTotalBalance.bind(this);
  }

  getPrices(props) {
    const _dex = props.Dex;
    let _prices = {};

    if (_dex &&
        _dex.prices &&
        _dex.prices.length) {
      for (let i = 0; i < _dex.prices.length; i++) {
        for (let j = 0; j < _dex.prices[i].asks.length; j++) {
          if (!_prices[_dex.prices[i].asks[j][0] + '/' + _dex.prices[i].asks[j][1]]) {
            _prices[_dex.prices[i].asks[j][0] + '/' + _dex.prices[i].asks[j][1]] = _dex.prices[i].asks[j][2];
          } else {
            _prices[_dex.prices[i].asks[j][0] + '/' + _dex.prices[i].asks[j][1]] += _dex.prices[i].asks[j][2];
          }
        }
      }
    }

    console.warn(_prices);
  }

  renderCoinsList() {

  }

  calcTotalBalance() {
    mainWindow.getMMCacheData()
    .then((res) => {
      const { rates, coins } = res;
      let _coins = {};
      let _totalKMDValue = 0;

      if (rates &&
          rates.BTC &&
          rates.USD) {
        for (let i = 0; i < coins.length; i++) {
          console.log(coins[i].coin + ' ' + coins[i].balance);
          _coins[coins[i].coin] = coins[i];
          if (Number(coins[i].balance) > 0) {
            _totalKMDValue += Number(coins[i].KMDvalue);
          }
        }
        console.log(_totalKMDValue);
      }
    });
  }

  getCoinSVG(coin) {
    // todo add asset chains
    if (coin !== 'MNZ') {
      const SVGCryptoCoins = coinIcon.BtcAlt;
      return <SVGCryptoCoins size={40} />;
    } else {
      return SVGMNZ;
    }
  }

  componentWillMount() {
    this.calcTotalBalance();
  }

  componentWillReceiveProps(props) {
    this.getPrices(props);
  }

  render() {
    return (
      <section className="dashboard">
        <section className="dashboard-wallets">
          <header className="dashboard-wallets-header component-header">
            <i className="dashboard-empty-logo">
              <SVGFaviconBlack />
            </i>
            <div className="recharts-responsive-container dashboard-balances-pie" style={{ width: '250px', height: '450px' }}>
            { /* portfolio chart here */ }
            </div>
            <h1 style={{ color: '#9e9e9e' }}>
              <label>Estimated balance</label>
              <span>0.00345625 BTC</span>
              <small className="margin-top-10">$32.21</small>
            </h1>
            <button className="action dark margin-top-15">
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
            <li className="coinList-coin BTC">
              <a className="BTC">
                <div className="coinList-coin_icon coin-colorized">
                  <i className="coin-icon-svg crypto-icons-pack BTC">
                    { this.getCoinSVG() }
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
                { this.state.coinLoading &&
                  <DexLoaderSmall />
                }
              </a>
            </li>
          </ul>
        </section>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Dashboard: state.Dashboard,
    Dex: state.Dex,
  };
};

export default connect(mapStateToProps)(DexCoins);
