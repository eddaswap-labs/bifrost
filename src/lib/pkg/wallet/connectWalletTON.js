import TonConnect from '@tonconnect/sdk';

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

	connector.onStatusChange((wallet) => {
		console.log(wallet);
		if (connector.connected && wallet) {
			setWalletAddress(wallet.account.address);
		}
	}, console.error);

	return connector.connect(walletConnectionSource);
};
