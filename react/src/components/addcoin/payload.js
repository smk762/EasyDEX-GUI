// TODO: merge check functions
//			 move to nodejs
//			 cleanup
import { isKomodoCoin } from 'agama-wallet-lib/src/coin-helpers';

export const checkAC = (coinVal) => {
	return isKomodoCoin(coinVal, true);
}

export const startCurrencyAssetChain = (confpath, coin, mode) => {
	const assetChainPorts = window.require('electron').remote.getCurrentWindow().assetChainPorts;

	return assetChainPorts[coin];
}

export const startAssetChain = (confpath, coin, mode, getSuppyOnly) => {
	const assetChainPorts = window.require('electron').remote.getCurrentWindow().assetChainPorts;

	if (mode === '-1') {
		if (getSuppyOnly) {
			return acConfig[coin].supply;
		} else {
			return assetChainPorts[coin];
		}
	}
}

export const startCrypto = (confpath, coin, mode) => {
	const assetChainPorts = window.require('electron').remote.getCurrentWindow().assetChainPorts;

	coin = coin === 'KMD' ? 'komodod' : coin;
	return assetChainPorts[coin];
}

export const acConfig = window.require('electron').remote.getCurrentWindow().chainParams;;