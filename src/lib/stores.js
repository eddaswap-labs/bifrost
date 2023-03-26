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

	const connectExternal = async (cb) => {
		let link = await wallet.connectExternal((address) => {
			set({
				address,
				connected: true
			});

			cb();
		});

		return link;
	};

	const disconnect = async () => {
		await wallet.disconnect();

		set({
			address: '',
			connected: false
		});
	};

	const lockCoins = (destAddress, destCoinId, amount) =>
		wallet.lockCoins(destAddress, destCoinId, amount);

	const burnTokens = (destAddress, coinId, amount) =>
		wallet.burnTokens(destAddress, coinId, amount);

	return {
		subscribe,
		connectInjected,
		connectExternal,
		disconnect,
		lockCoins,
		burnTokens,
		available: wallet.available
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

			let connected = derived(Object.values(walletStores), (wallets) => {
				return wallets.some((wallet) => wallet.connected);
			});

			let address = derived(Object.values(walletStores), (wallets) => {
				let addresses = wallets.map((wallet) => wallet.address);
				return addresses.filter((address) => address !== '')[0];
			});

			set({ connected, address, wallets: walletStores });
		},
		async disconnect() {
			let network = get(this);
			for (let wallet of Object.values(network.wallets)) {
				await wallet.disconnect();
			}
		}
	};
};

export const Ethereum = makeNetworkStore();
export const Tezos = makeNetworkStore();
export const TON = makeNetworkStore();
