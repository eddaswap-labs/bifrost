import { derived, writable, get } from 'svelte/store';
import { MetaMask } from './pkg/wallet/ethereum/metamask';
import { TonKeeper } from './pkg/wallet/ton/tonkeeper';
import { TempleWallet as TezosTempleWallet } from './pkg/wallet/tezos/temple';
import { Wallet } from './pkg/wallet/wallet';

const makeWalletStore = (wallet) => {
	if (!wallet.prototype instanceof Wallet) {
		throw new Error('Invalid wallet type');
	}

	const { subscribe, set } = writable({});

	const connectInjected = async () => {
		let walletAddress = await wallet.connectInjected();

		set({
			address: walletAddress,
			connected: true
		});
	};

	const connectExternal = async () => {
		let link = await wallet.connectExternal((address) => {
			set({
				address: walletAddress,
				connected: true
			});
		});

		return link;
	};

	const disconnect = async () => {
		set({
			address: '',
			connected: false
		});
	};

	return {
		subscribe,
		connectInjected,
		connectExternal,
		disconnect,
		lockCoins: wallet.lockCoins,
		burnTokens: wallet.burnTokens
	};
};

export const EthereumWallets = {
	MetaMask: makeWalletStore(new MetaMask())
};
export const TezosWallets = makeWalletStore({
	TempleWallet: makeWalletStore(new TezosTempleWallet())
});
export const TonWallets = makeWalletStore({
	TonKeeper: makeWalletStore(new TonKeeper())
});

const makeNetworkStore = (walletStores) => {
	const connected = derived(Object.values(walletStores), (wallets, set) => {
		set(wallets.some(($wallet) => $wallet.connected));
	});

	const address = derived(Object.values(walletStores), (wallets, set) => {
		set(wallets.filter(($wallet) => $wallet.connected)[0].address);
	});

	return {
		subscribe,
		connected,
		address,
		...walletStores
	};
};

export const Ethereum = makeNetworkStore(EthereumWallets);
export const Tezos = makeNetworkStore(TezosWallets);
export const TON = makeNetworkStore(TonWallets);
