import { writable, get, derived } from 'svelte/store';
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

	const disconnect = () => {
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

const makeNetworkStore = () => {
	let initialValue = {};
	const { subscribe, set } = writable(initialValue);

	return {
		subscribe,
		init(wallets) {
			let walletStores = {};
			for (let [key, value] of Object.entries(wallets)) {
				walletStores[key] = makeWalletStore(value);
			}

			let connected = derived(Object.values(walletStores), (wallets, set) => {
				const status = wallets.some((wallet) => wallet.connected);
				set(status);

				return status;
			});

			let address = derived(Object.values(walletStores), (wallets, set) => {
				let addresses = wallets.map((wallet) => wallet.address);
				let connectedAddress = addresses.filter((address) => address !== '')[0];
				set(connectedAddress);

				return connectedAddress;
			});

			set({ connected, address, wallets: walletStores });
		},
		disconnect() {
			let network = get(this);
			for (let wallet of Object.values(network.wallets)) {
				wallet.disconnect();
			}
		}
	};
};

export const Ethereum = makeNetworkStore();
export const Tezos = makeNetworkStore();
export const TON = makeNetworkStore();
