import React from 'react';
import translate from '../../translate/translate';

class AddCoinTile extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  renderTiles() {
    const coins = this.props.coins;
    let items = [];

    for (let i = 0; i < coins.length; i++) {
      console.log(coins[i]);

      items.push(
        <div
          key={ `addcoin-tile-${i}` }
          className="addcoin-tile">
          { coins[i].value.indexOf('ETH|') > -1 &&
            coins[i].value !== 'ETH|ropsten' &&
            <div className="badge badge--erc20">ERC20</div>
          }
          <img
            src={ `assets/images/cryptologo/${coins[i].icon.toLowerCase()}.png` }
            alt={ coins[i].label }
            width="30px"
            height="30px" />
          <span className="margin-left-10">{ coins[i].label }</span>
        </div>
      );
    }

    if (!items.length) {
      items.push(
        <div
          key="addcoin-tile-empty">
          No matching results found
        </div>
      );
    }

    return items;
  }

  render() {
    return (
      <div className="addcoin-tiles">
        { this.renderTiles() }
      </div>
    );
  }
}

export default AddCoinTile;