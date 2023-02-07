import TonConnect from '@tonconnect/sdk';
import { Address } from 'ton';
import { Wallet } from '../wallet';

/**
 * Implements Wallet abstract class for TonKeeper.
 *
 * @class TonKeeper
 */
export class TonKeeper extends Wallet {
	constructor() {
		let walletsList = [];
		TonConnect.getWallets().then((wl) => {
			walletsList = wl;
		});

		this.walletConnectionSource = {
			universalLink: walletsList[0].universalLink,
			bridgeUrl: walletsList[0].bridgeUrl
		};

		this.connector = new TonConnect({
			manifestUrl:
				'https://raw.githubusercontent.com/bifrost-defi/bifrost/main/tonconnect-manifest.json'
		});

		connector.restoreConnection();
	}

	async connectInjected() {
		throw new Error('Injected TonKeeper is not supported.');
	}

	async connectExternal(cb) {
		connector.onStatusChange((wallet) => {
			if (connector.connected && wallet) {
				let address = Address.parseRaw(wallet.account.address).toString();
				cb(address);
			}
		}, console.error);

		return connector.connect(walletConnectionSource);
	}
}
