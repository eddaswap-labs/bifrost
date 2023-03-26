import { TezosToolkit } from '@taquito/taquito';
import { isAvailable, TempleWallet as TWallet } from '@temple-wallet/dapp';
import { Wallet } from '../wallet';
import { ReadOnlySigner } from './signer';

/**
 * Implements Wallet abstract class for Temple Wallet.
 *
 * @class TempleWallet
 */
export default class TempleWallet extends Wallet {
	constructor() {
		super();

		TWallet.isAvailable().then((isAvailable) => {
			if (!isAvailable) {
				this.available = false;
			} else {
				this.available = true;
				this.wallet = new TWallet('Bifrost bridge');
			}
		});
	}

	async connectInjected() {
		if (!this.available) throw new Error('Temple Wallet not installed');

		if (this.wallet.connected) {
			return;
		}

		await this.wallet.connect('kathmandunet', {
			forcePermission: true
		});

		this.address = this.wallet.pkh || (await this.wallet.getPKH());
		const { pkh, publicKey } = this.wallet.permission;

		let url = 'https://kathmandunet.ecadinfra.com';

		const tzs = new TezosToolkit(url);
		tzs.setWalletProvider(this.wallet);
		tzs.setSignerProvider(new ReadOnlySigner(pkh, publicKey));

		return this.address;
	}

	async connectExternal(cb) {
		throw new Error('External Temple Wallet is not supported.');
	}

	async disconnect() {}

	async lockCoins(destAddress, destCoinId, amount) {}

	async burnTokens(token, amount) {}
}
