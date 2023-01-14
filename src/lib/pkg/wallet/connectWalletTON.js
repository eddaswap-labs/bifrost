import TonConnect from '@tonconnect/sdk';
import { Address } from 'ton';

export const connectWalletTON = async (setWalletAddress) => {
	const walletsList = await TonConnect.getWallets();

	const walletConnectionSource = {
		universalLink: walletsList[0].universalLink,
		bridgeUrl: walletsList[0].bridgeUrl
	};

	const connector = new TonConnect({
		manifestUrl:
			'https://raw.githubusercontent.com/bifrost-defi/bifrost/main/tonconnect-manifest.json'
	});

	connector.restoreConnection();

	connector.onStatusChange((wallet) => {
		if (connector.connected && wallet) {
			let address = Address.parseRaw(wallet.account.address).toString();
			setWalletAddress(address);
		}
	}, console.error);

	return connector.connect(walletConnectionSource);
};
