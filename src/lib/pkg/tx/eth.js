import { ethers } from 'ethers';
import { BRIDGE_ADDRESS } from '$env/static/private';

const bridgeABI = []; // TODO

const swapETH = async (destAddress, destCoinId, amount) => {
	const provider = new ethers.provider.Web3Provider(window.ethereum);
	const signer = provider.getSigner();

	const bridgeContract = new ethers.Contract(BRIDGE_ADDRESS, bridgeABI, signer);

	await bridgeContract.lock(destAddress, destCoinId, { value: ethers.utils.parseEther(amount) });
};

export default swapETH;
