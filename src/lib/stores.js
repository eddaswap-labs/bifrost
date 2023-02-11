import { writable, get } from 'svelte/store';
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

			set(walletStores);
		},
		connected() {
			const wallets = get(this);

			for (let [key, $value] of Object.entries(wallets)) {
				if ($value.connected) {
					return true;
				}
			}

			return false;
		},
		address() {
			const wallets = get(this);

			for (let [key, $value] of Object.entries(wallets)) {
				if ($value.connected) {
					return $value.address;
				}
			}

			return '';
		}
	};
};

export const Ethereum = makeNetworkStore();
export const Tezos = makeNetworkStore();
export const TON = makeNetworkStore();
