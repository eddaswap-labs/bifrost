import { ethers } from 'ethers';
import SignClient from '@walletconnect/sign-client';
import { Web3Modal } from '@web3modal/standalone';

export const connectMetamask = async () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);

	await provider.send('eth_requestAccounts', []);
	const signer = provider.getSigner();

	let userAddress = await signer.getAddress();

	return userAddress;
};

export const connectWalletConnect = async () => {
	const web3Modal = new Web3Modal({
		projectId: '<YOUR_PROJECT_ID>',
		standaloneChains: ['eip155:1']
	});
	const signClient = await SignClient.init({ projectId: '<YOUR_PROJECT_ID>' });

	const { uri, approval } = await signClient.connect({
		requiredNamespaces: {
			eip155: {
				methods: ['eth_sign'],
				chains: ['eip155:1'],
				events: ['accountsChanged']
			}
		}
	});

	if (uri) {
		web3Modal.openModal({ uri, standaloneChains: ['eip155:1'] });
		await approval();
		web3Modal.closeModal();
	}
};
