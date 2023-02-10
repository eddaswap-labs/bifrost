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

const makeNetworkStore = (walletStores) => {
	const { subscribe, set, update } = writable({});

	const connected = () => {
		get(this).some(($wallet) => $wallet.connected);
	};

	const address = () => get(this).filter(($wallet) => $wallet.connected)[0].address;

	const init = async () => {
		for (let [key, value] of Object.entries(walletStores)) {
			walletStores[key] = makeWalletStore(value);
		}
	};

	return {
		subscribe,
		init,
		connected,
		address,
		...walletStores
	};
};

export const Ethereum = makeNetworkStore(EthereumWallets);
export const Tezos = makeNetworkStore(TezosWallets);
export const TON = makeNetworkStore(TonWallets);
