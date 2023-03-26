import { ethers } from 'ethers';
import { Wallet } from '../wallet';

const bridgeABI = []; // TODO
const tokenABI = []; // TODO

/**
 * Implements Wallet abstract class for MetaMask.
 *
 * @class MetaMask
 */
export default class MetaMask extends Wallet {
	constructor() {
		super();

		if (!window.ethereum) {
			this.available = false;
		} else {
			this.available = true;
			this.provider = new ethers.providers.Web3Provider(window.ethereum);
		}
	}

	async connectInjected() {
		if (!this.available) throw new Error('MetaMask is not installed');

		await this.provider.send('eth_requestAccounts', []);
		const signer = this.provider.getSigner();

		this.address = await signer.getAddress();

		return this.address;
	}

	async disconnect() {
		this.connected = false;
	}

	async connectExternal(cb) {
		throw new Error('External MetaMask is not supported.');
	}

	async lockCoins(destAddress, destCoinId, amount) {
		const signer = this.provider.getSigner();

		const bridgeContract = new ethers.Contract(BRIDGE_ADDRESS, bridgeABI, signer);

		await bridgeContract.lock(destAddress, destCoinId, { value: ethers.utils.parseEther(amount) });
	}

	async burnTokens(token, amount) {
		const signer = this.provider.getSigner();

		const tokenContract = new ethers.Contract(token, tokenABI, signer);

		await tokenContract.burn(amount);
	}
}
