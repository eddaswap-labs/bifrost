import { Address } from 'ton';

/**
 * Abstract class Wallet
 * All wallet classes must extend this class.
 *
 * @abstract Wallet
 */
export class Wallet {
	/**
	 * True if user has wallet installed in browser, false otherwise.
	 * For external wallets its always true.
	 */
	available;
	/**
	 * The connection status.
	 * True if connected, false otherwise.
	 *
	 * @public
	 * @type {boolean}
	 */
	connected;
	/**
	 * The address of the wallet.
	 *
	 * @public
	 * @type {string}
	 */
	address;

	constructor() {
		if (this.constructor == Wallet) {
			throw new Error("Abstract classes can't be instantiated.");
		}
	}

	/**
	 * Connects to the browser wallet.
	 *
	 * @returns {string} address
	 */
	connectInjected() {
		throw new Error("Method 'connectInjected' must be implemented.");
	}

	/**
	 * Returns link for connection through external wallet.
	 * Use it for generating QR code or some other way to connect.
	 * Callback function is called when connection is established. The address is passed as a parameter.
	 *
	 * @param {function} cb
	 * @returns {string} link
	 */
	connectExternal(cb) {
		throw new Error("Method 'connectExternal' must be implemented.");
	}

	/**
	 * Sends transaction that calls the method that locks coins on the chain.
	 * It starts the native-to-wrapped swap process.
	 *
	 * @param {string} destAddress
	 * @param {string} destCoinId
	 * @param {string} amount
	 */
	lockCoins(destAddress, destCoinId, amount) {
		throw new Error("Method 'lockCoins' must be implemented.");
	}

	/**
	 * Calls burn method in the token (or jetton) contract.
	 * It starts the wrapped-to-native swap process.
	 *
	 * @param {string} token
	 * @param {string} amount
	 */
	burnTokens(token, amount) {
		throw new Error("Method 'burnTokens' must be implemented.");
	}
}
