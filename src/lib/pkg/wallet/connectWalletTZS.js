import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import { ReadOnlySigner } from './signer';

export const connectTempleWallet = async () => {
	try {
		const available = await TempleWallet.isAvailable();
		if (!available) {
			throw new Error('Temple Wallet not installed');
		}
	} catch (err) {
		console.log(err);
	}

	const wallet = new TempleWallet('Bifrost bridge');

	if (!wallet.connected) {
		await wallet.connect('kathmandunet', {
			forcePermission: true
		});
	}

	let address = wallet.pkh || (await wallet.getPKH());
	const { pkh, publicKey } = wallet.permission;

	let url = 'https://kathmandunet.ecadinfra.com';

	const tzs = new TezosToolkit(url);
	tzs.setWalletProvider(wallet);
	tzs.setSignerProvider(new ReadOnlySigner(pkh, publicKey));

	return address;
};
