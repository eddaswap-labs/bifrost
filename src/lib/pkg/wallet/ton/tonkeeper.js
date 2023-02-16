import TonConnect from '@tonconnect/sdk';
import { Address } from 'ton';
import { Wallet } from '../wallet';

/**
 * Implements Wallet abstract class for TonKeeper.
 *
 * @class TonKeeper
 */
export default class TonKeeper extends Wallet {
	constructor() {
		super();

		this.available = true;
		this.connector = new TonConnect({
			manifestUrl:
				'https://raw.githubusercontent.com/bifrost-defi/bifrost/main/tonconnect-manifest.json'
		});
	}

	async connectInjected() {
		throw new Error('Injected TonKeeper is not supported.');
	}

	async connectExternal(cb) {
		const walletsList = await TonConnect.getWallets();

		const walletConnectionSource = {
			universalLink: walletsList[0].universalLink,
			bridgeUrl: walletsList[0].bridgeUrl
		};

		this.connector.onStatusChange((wallet) => {
			if (this.connector.connected && wallet) {
				this.address = Address.parseRaw(wallet.account.address).toString();
				cb(this.address);
			}
		}, console.error);

		return this.connector.connect(walletConnectionSource);
	}
}
