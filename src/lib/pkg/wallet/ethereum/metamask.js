import { ethers } from 'ethers';
import { Wallet } from '../wallet';
import { PUBLIC_ETH_BRIDGE_ADDRESS } from '$env/static/public';
import BridgeABI from './bridge_abi.json';

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

		const bridgeContract = new ethers.Contract(PUBLIC_ETH_BRIDGE_ADDRESS, BridgeABI, signer);

		await bridgeContract.lock(destAddress, destCoinId, { value: ethers.utils.parseEther(amount) });
	}

	async burnTokens(destAddress, coinId, amount) {
		const signer = this.provider.getSigner();

		const bridgeContract = new ethers.Contract(PUBLIC_ETH_BRIDGE_ADDRESS, BridgeABI, signer);

		await bridgeContract.burnERC20(coinId, destAddress, ethers.utils.parseEther(amount));
	}
}
