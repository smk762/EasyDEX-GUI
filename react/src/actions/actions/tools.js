import translate from '../../translate/translate';
import Config, {
  token,
  agamaPort,
  rpc2cli,
} from '../../config';
import { triggerToaster } from '../actionCreators';
import Store from '../../store';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';

export const apiToolsSeedKeys = (seed) => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/api/electrum/keys`,
      fetchType(
        JSON.stringify({
          seed,
          active: true,
          iguana: true,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getTools') + ' (code: apiToolsSeedKeys)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export const apiToolsBalance = (coin, address) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token: Config.token,
      coin,
      address,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/api/electrum/getbalance${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.getTools') + ' (code: apiToolsBalance)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export const apiToolsTransactions = (coin, address) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      coin,
      address,
      full: true,
      maxlength: 20,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/api/electrum/listtransactions${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          translate('API.getTools') + ' (code: apiToolsTransactions)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export const apiToolsBuildUnsigned = (coin, value, sendToAddress, changeAddress) => {
  value = Math.floor(value);

  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      coin,
      value,
      address: sendToAddress,
      change: changeAddress,
      verify: false,
      push: false,
      offline: true,
    };
    return fetch(
      `http://127.0.0.1:${agamaPort}/api/electrum/createrawtx${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getTools') + ' (code: apiToolsBuildUnsigned)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}

export const apiToolsListunspent = (coin, address) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      coin,
      address,
      full: true,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/api/electrum/listunspent${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getTools') + ' (code: apiToolsListunspent)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export const apiToolsPushTx = (network, rawtx) => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/api/electrum/pushtx`,
      fetchType(
        JSON.stringify({
          network,
          rawtx,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getTools') + ' (code: apiToolsPushTx)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export const apiToolsWifToKP = (coin, wif) => {
  return new Promise((resolve, reject) => {
    const _urlParams = {
      token,
      coin,
      wif,
    };
    fetch(
      `http://127.0.0.1:${agamaPort}/api/electrum/wiftopub${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getTools') + ' (code: apiToolsWifToKP)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

export const apiToolsSeedToWif = (seed, network, iguana) => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://127.0.0.1:${agamaPort}/api/electrum/seedtowif`,
      fetchType(
        JSON.stringify({
          seed,
          network,
          iguana,
          token,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.getTools') + ' (code: apiToolsSeedToWif)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      resolve(!json.result ? 'error' : json);
    });
  });
}

// remote bitcore api
export const apiToolsMultiAddressBalance = (addressList, fallback, explorerEndPoint) => {
  return new Promise((resolve, reject) => {
    fetch(
      explorerEndPoint ? explorerEndPoint + '/insight-api-komodo/addrs/utxo' : fallback ? 'https://kmdexplorer.io/insight-api-komodo/addrs/utxo' : 'https://www.kmdexplorer.ru/insight-api-komodo/addrs/utxo',
      fetchType(
        JSON.stringify({
          addrs: addressList,
        })
      ).post
    )
    .catch((error) => {
      console.log(error);
      if (!explorerEndPoint) {
        console.warn(`apiToolsMultiAddressBalance has failed, ${fallback ? ' use fallback' : ' all routes have failed'}`);

        resolve({
          msg: 'error',
          code: fallback ? -1554 : -777,
        });
      }
    })
    .then((response) => {
      const _response = response.text().then((text) => { return text; });
      return _response;
    })
    .then(json => {
      try {
        json = JSON.parse(json);

        if (json.length ||
            (typeof json === 'object' && !Object.keys(json).length)) {
          resolve({
            msg: 'success',
            result: json,
          });
        } else {
          resolve({
            msg: 'error',
            result: 'error parsing response',
          });
        }
      } catch (e) {
        resolve({
          msg: 'error',
          result: json.indexOf('<html>') === -1 ? json : 'error parsing response',
        });
      }
    });
  });
}

// src: atomicexplorer.com
export const apiToolsMultiAddressBalanceCoins = (address) => {
  return new Promise((resolve, reject) => {
    //const json = {"msg":"success","result":{"balance":[{"coin":"COQUI","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"REVS","balanceSats":{"confirmed":31171304,"unconfirmed":0},"balance":{"confirmed":0.31171304,"unconfirmed":0}},{"coin":"SUPERNET","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"DEX","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"BOTS","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"CRYPTO","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"HODL","balanceSats":{"confirmed":185000000000000,"unconfirmed":0},"balance":{"confirmed":1850000,"unconfirmed":0}},{"coin":"PANGEA","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"BET","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"MSHARK","balanceSats":{"confirmed":1000000000000,"unconfirmed":0},"balance":{"confirmed":10000,"unconfirmed":0}},{"coin":"MNZ","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"WLC","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"JUMBLR","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"MGW","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"KMD","balanceSats":{"confirmed":2261815895696,"unconfirmed":0},"balance":{"confirmed":22618.15895696,"unconfirmed":0}},{"coin":"CHIPS","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"BTCH","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"BEER","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"PIZZA","balanceSats":{"confirmed":2939216372,"unconfirmed":0},"balance":{"confirmed":29.39216372,"unconfirmed":0}},{"coin":"OOT","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"BNTN","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},"error",{"coin":"KV","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"PRLPAY","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"ZILLA","balanceSats":{"confirmed":21317048037,"unconfirmed":0},"balance":{"confirmed":213.17048037,"unconfirmed":0}},{"coin":"EQL","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"GLXT","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},"error",{"coin":"CCL","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"CALL","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}},{"coin":"VRSC","balanceSats":{"confirmed":0,"unconfirmed":0},"balance":{"confirmed":0,"unconfirmed":0}}],"transactions":[{"coin":"REVS","blockindex":17303,"txid":"f8a3c6dfbf04be7021c7ae34ff6d57645fd95df67c4c77330ac5c8b879b5fc05","timestamp":1511957648},{"coin":"HODL","blockindex":5181,"txid":"cc33320da6eb38edcca40f1e3c3a977c2490c7201f63e035a0d81d62f133be8b","timestamp":1512159856},{"coin":"MSHARK","blockindex":134,"txid":"2e0aafd7458ad1ace99c4c8139f70355ea68eaef21f53c688010af24ee28cc8c","timestamp":1512159862},{"coin":"ZILLA","blockindex":66097,"txid":"fb2697576e005226eca2b5e6e12e8827393aaad9760b8edd30b169d0be816e11","timestamp":1535582572},{"coin":"PIZZA","blockindex":6044,"txid":"c74ba59ceb8a368a8af20ad8b1efa3c098256535d3f14c16241f0d0ac773bfe9","timestamp":1521400120},{"coin":"PIZZA","blockindex":6039,"txid":"8e65f1ee6f20c1447ee8362d7ee8a3a93111185714b9334c7b856849987ca71b","timestamp":1521399931},{"coin":"PIZZA","blockindex":6034,"txid":"12b2875e9e99727708bd1281f47cd9c55ef9845b69c166f377c930f459d5882b","timestamp":1521399672},{"coin":"PIZZA","blockindex":3482,"txid":"0dbe49ad9e51e93676bac6199ba994e32e61d30c80463a85add062e52f8b1876","timestamp":1518725425},{"coin":"KMD","blockindex":1070625,"txid":"9677821038017df9ab394c790bbac6b1b6acf3678beb8cb9b0cd4a385c3a099a","timestamp":1540617370},{"coin":"KMD","blockindex":1060838,"txid":"b6799051c2dc627a41347d6cc148e94f10a9be8af735873a0511a2bb33923e02","timestamp":1540027412},{"coin":"KMD","blockindex":1085364,"txid":"5d0a563f80f805d42c29deb8fe82e1f847448301400c8a06dd04d426e4e150b4","timestamp":1541505288},{"coin":"KMD","blockindex":1060726,"txid":"82ef9a68496eadf31c06ab98dd957f7bdced9379fb05fbf400f3c48e056f6120","timestamp":1540020241},{"coin":"KMD","blockindex":1032036,"txid":"e6ec45ab6244450220f0a3960a6a1478cfd1be8fb75b4448d14cef0ee07f8ab8","timestamp":1538293516},{"coin":"KMD","blockindex":1035092,"txid":"5f7d9acff682fae1e73883888855ecba61e6454ca071172fb8a9d5a6048aac8d","timestamp":1538478154},{"coin":"KMD","blockindex":1046399,"txid":"415a0dd7dd3671506f9cc3dd8544a1800cfee258b7185ab486a5f391abdcf03c","timestamp":1539157883},{"coin":"KMD","blockindex":1032011,"txid":"b33f835404d6c650577180de2b96877836c29295556e953143b9f1eaa7ab3f09","timestamp":1538292076},{"coin":"KMD","blockindex":1034699,"txid":"83984a33abe3b3a28a9375936e9bda0a673466f8482c12170929d50ed019205a","timestamp":1538454057},{"coin":"KMD","blockindex":1022974,"txid":"80f670fcab55d216422def7c7ee4a8464a2362f407eaf44201b9ef32cceeb961","timestamp":1537748447},{"coin":"KMD","blockindex":1012295,"txid":"7f8adaa2569ee8af5e9ea4cdcc9c080f1c3bf98ce05e3c2e62b09ebfbd8de5c3","timestamp":1537105818},{"coin":"KMD","blockindex":1009475,"txid":"ce6d139c557c0daaa6d175268843080a793d301dddde67b4a4f71ecc22b65942","timestamp":1536936640},{"coin":"KMD","blockindex":991948,"txid":"28a21d60d6a1c050a80be329a5bbbce611574dfe02640e1ea4ebf2b5083b100e","timestamp":1535879466},{"coin":"KMD","blockindex":1007083,"txid":"245eada0953211ac6da95609ce5035489138ed0f3dfee877a3652f915ea9ee5e","timestamp":1536792792},{"coin":"KMD","blockindex":1009472,"txid":"138713229ad805e0d0e911a0f6342f28cab10b1d498c63ebb8af9b0da556dd18","timestamp":1536936420},{"coin":"KMD","blockindex":959462,"txid":"ba4008bebb05d073c3761fb6b9625ef87dfa53b22d5a1b60914c36d2f8969723","timestamp":1533916775},{"coin":"KMD","blockindex":1007628,"txid":"49f01570fd1c61b42e881e5d42a5664c79b6f0788d179ef744839aa0a18266c9","timestamp":1536825023},{"coin":"KMD","blockindex":960002,"txid":"da6c535f8ccdea22072076ebb913a1c45d7ccfd5bf51e139b2b362d07207c35d","timestamp":1533949838},{"coin":"KMD","blockindex":959505,"txid":"9287f66dbfcfe3e6eeece2ae5a0a83b82d015272a8ca056353caca0aba1df18f","timestamp":1533920286},{"coin":"KMD","blockindex":959355,"txid":"a9be0b76d833b9684eb6a05daa4c2deaac7d9bb7faa7cd7e523c49d672cf3bc7","timestamp":1533910707}]}};
    //resolve(json);
    fetch(
      'https://www.atomicexplorer.com/api/explorer/search?term=' + address,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
    })
    .then(response => response.json())
    .then(json => {
      resolve(json);
    });
  });
}