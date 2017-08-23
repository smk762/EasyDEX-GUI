import React from 'react';
import { connect } from 'react-redux';
import { atomic } from '../../../actions/actionCreators';
import Store from '../../../store';

import AtomicRender from './atomic.render';

/*
  TODO:
    1) pre-select active coin
    2) validation
*/
class Atomic extends React.Component {
  constructor() {
    super();
    this.state = {
      output: null,
      api: null,
      coin: null,
      input: null,
    };
    this.updateSelectedAPI = this.updateSelectedAPI.bind(this);
    this.updateSelectedCoin = this.updateSelectedCoin.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.getAtomicData = this.getAtomicData.bind(this);
  }

  updateSelectedAPI(e) {
    this.setState(Object.assign({}, this.state, {
      api: e.target.value,
    }));
  }

  updateSelectedCoin(e) {
    this.setState(Object.assign({}, this.state, {
      coin: e.target.value.split('|')[0],
    }));
  }

  updateInput(e) {
    this.setState(Object.assign({}, this.state, {
      input: e.target.value,
    }));
  }

  getAtomicData() {
    const tmpIguanaRPCAuth = `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`;
    let explorerInputData;
    const _coin = this.state.coin;
    const _input = this.state.input;

    switch (this.state.api) {
      case 'history':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          timeout: 20000,
          agent: 'basilisk',
          method: 'history',
          vals: {
            coin: _coin,
            addresses: [ _input ],
          }
        };
        break;
      case 'getbalance':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          coin: _coin,
          method: 'getbalance',
          params: [ _input ],
        };
        break;
      case 'listunspent':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          coin: _coin,
          method: 'listunspent',
          params: [
            1,
            9999999,
            [ _input ],
          ]
        };
        break;
      case 'txid':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          coin: _coin,
          method: 'getrawtransaction',
          params: [ _input ],
        };
        break;
      case 'blockash':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          coin: _coin,
          agent: 'bitcoinrpc',
          method: 'getblockhash',
          height: _input,
        };
        break;
      case 'chaintip':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          coin: _coin,
          agent: 'bitcoinrpc',
          method: 'getbestblockhash',
        };
        break;
      case 'activehandle':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'SuperNET',
          method: 'activehandle',
        };
        break;
      case 'gettransaction':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          coin: _coin,
          agent: 'bitcoinrpc',
          method: 'gettransaction',
          txid: _input,
        };
        break;
      case 'dex_getinfo':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'getinfo',
          symbol: _coin,
        };
        break;
      case 'dex_getnotaries':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'getnotaries',
          symbol: _coin,
        };
        break;
      case 'dex_alladdresses':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'alladdresses',
          symbol: _coin,
        };
        break;
      case 'dex_importaddress':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'importaddress',
          address: _input,
          symbol: _coin,
        };
        break;
      case 'dex_checkaddress':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'checkaddress',
          address: _input,
          symbol: _coin,
        };
        break;
      case 'dex_validateaddress':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'validateaddress',
          address: _input,
          symbol: _coin,
        };
        break;
      case 'dex_getbestblockhash':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'getbestblockhash',
          symbol: _coin,
        };
        break;
      case 'dex_listtransactions':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'listtransactions',
          address: _input,
          count: 100,
          skip: 0,
          symbol: _coin,
        };
        break;
      case 'dex_listtransactions2':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'listtransactions2',
          address: _input,
          count: 100,
          skip: 0,
          symbol: _coin,
        };
        break;
      case 'dex_listunspent':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'listunspent',
          address: _input,
          symbol: _coin,
        };
        break;
      case 'dex_listspent':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'listspent',
          address: _input,
          symbol: _coin,
        };
        break;
      case 'dex_listunspent2':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'listunspent2',
          address: _input,
          symbol: _coin,
        };
        break;
      case 'dex_getblockhash':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'getblockhash',
          height: 100,
          symbol: _coin,
        };
        break;
      case 'dex_getblock':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'getblock',
          hash: _input,
          symbol: _coin,
        };
        break;
      case 'dex_gettxin':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'gettxin',
          vout: 0,
          txid: _input,
          symbol: _coin,
        };
        break;
      case 'dex_gettxout':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'gettxout',
          vout: 0,
          txid: _input,
          symbol: _coin,
        };
        break;
      case 'dex_gettransaction':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'gettransaction',
          txid: _input,
          symbol: _coin,
        };
        break;
      case 'dex_getbalance':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'getbalance',
          address: _input,
          symbol: _coin,
        };
        break;
      case 'dex_getsupply':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'getbalance',
          address: '*',
          symbol: _coin,
          timeout: 600000,
        };
        break;
      case 'dex_sendrawtransaction':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'dex',
          method: 'sendrawtransaction',
          signedtx: _input,
          symbol: _coin,
        };
        break;
      case 'basilisk_refresh':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'basilisk',
          method: 'refresh',
          address: _input,
          symbol: _coin,
          timeout: 600000,
        };
        break;
      case 'jumblr_status':
        explorerInputData = {
          userpass: tmpIguanaRPCAuth,
          agent: 'jumblr',
          method: 'status',
        };
        break;
    }

    Store.dispatch(atomic(explorerInputData));
  }

  componentWillReceiveProps(props) {
    if (props &&
        props.Atomic.response) {
      const _api = this.state.api;
      const _propsAtomicRes = props.Atomic.response;

      if (_api === 'txid' ||
          _api === 'dex_getbestblockhash' ||
          _api === 'dex_sendrawtransaction' ||
          _api === 'dex_getblockhash') {
        this.setState(Object.assign({}, this.state, {
          output: _propsAtomicRes,
        }));
      } else {
        this.setState(Object.assign({}, this.state, {
          output: JSON.stringify(_propsAtomicRes, null, '\t'),
        }));
      }

      if (_propsAtomicRes.error === 'less than required responses') {
        Store.dispatch(
          triggerToaster(
            translate('TOASTR.BASILISK_CONN_ERROR'),
            translate('TOASTR.SERVICE_NOTIFICATION'),
            'error'
          )
        );
      }
    }
  }

  renderAtomicOptions() {
    const _options = [
      {
        method: 'history',
        name: 'Address History',
      },
      {
        method: 'getbalance',
        name: 'Get Balance',
      },
      {
        method: 'listunspent',
        name: 'List Unspent',
      },
      {
        method: 'txid',
        name: 'Transaction ID',
      },
      {
        method: 'blockash',
        name: 'Block Hash',
      },
      {
        method: 'chaintip',
        name: 'Chain Tip',
      },
      {
        method: 'activehandle',
        name: 'Active Handle',
      },
      {
        method: 'gettransaction',
        name: 'Get Transaction',
      },
      {
        method: 'dex_alladdresses',
        name: 'DEX All Addresses',
      },
      {
        method: 'dex_importaddress',
        name: 'DEX Import Address',
      },
      {
        method: 'dex_checkaddress',
        name: 'DEX Check Address',
      },
      {
        method: 'dex_validateaddress',
        name: 'DEX Validate Address',
      },
      {
        method: 'dex_getinfo',
        name: 'DEX Get Info',
      },
      {
        method: 'dex_getnotaries',
        name: 'DEX Get Notaries',
      },
      {
        method: 'dex_getbestblockhash',
        name: 'DEX Get Best Block Has',
      },
      {
        method: 'dex_getblock',
        name: 'DEX Get Block',
      },
      {
        method: 'dex_gettxin',
        name: 'DEX Get Txin',
      },
      {
        method: 'dex_gettxout',
        name: 'DEX Get Txout',
      },
      {
        method: 'dex_gettransaction',
        name: 'DEX Get Transaction',
      },
      {
        method: 'dex_getbalance',
        name: 'DEX Get Balance',
      },
      {
        method: 'dex_getsupply',
        name: 'DEX Get Supply',
      },
      {
        method: 'dex_listtransactions',
        name: 'DEX List Transactions',
      },
      {
        method: 'dex_listtransactions2',
        name: 'DEX List Transactions 2',
      },
      {
        method: 'dex_listspent',
        name: 'DEX List Spent',
      },
      {
        method: 'dex_listunspent',
        name: 'DEX List Unspent',
      },
      {
        method: 'dex_listunspent2',
        name: 'DEX List Unspent 2',
      },
      {
        method: 'dex_sendrawtransaction',
        name: 'DEX Send Raw Transaction',
      },
      {
        method: 'basilisk_refresh',
        name: 'Basilisk Refresh',
      },
      {
        method: 'jumblr_status',
        name: 'Jumbler Status',
      },
    ];

    let items = [];

    for (let i = 0; i < _options.length; i++) {
      items.push(
        <option
          key={ _options[i].method }
          value={ _options[i].method }>
            { _options[i].name }
        </option>
      );
    }

    return items;
  }

  render() {
    return AtomicRender.call(this);
  }
}
const mapStateToProps = (state) => {
  return {
    Atomic: {
      response: state.Atomic.response,
    }
  };
 
};

export default connect(mapStateToProps)(Atomic);
