<script>
	import MetamaskLogo from '$lib/images/metamask_logo.png';
	import { shortAccountString } from '$lib/pkg/utils';
	import { Ethereum } from '$lib/stores.js';
	import { fade } from 'svelte/transition';
	import HashIcon from '../HashIcon.svelte';

	const { connected, address, wallets } = $Ethereum;

	export let connectedWallet;

	let errorMessage = '';

	let isConnectingModalOpen = false;
	let isDisconnectingModalOpen = false;
	const connect = async (wallet) => {
		switch (wallet) {
			case 'metamask':
				if (!wallets.MetaMask.available) {
					errorMessage = 'MetaMask is not installed!';
					return;
				}

				await wallets.MetaMask.connectInjected();

				connectedWallet = wallets.MetaMask;

				break;
			case 'walletconnect':
				break;
		}
		isConnectingModalOpen = false;
	};
	const disconnect = async () => {
		await Ethereum.disconnect();
		isDisconnectingModalOpen = false;
	};
</script>

<div class="w-full">
	{#if !$connected}
		<label for="connect-modal-eth" class="btn btn-sm w-full btn-secondary">Connect Wallet</label>
	{:else}
		<label for="disconnect-modal-eth" class="btn btn-sm w-full btn-secondary gap-2"
			><HashIcon value={$address} size={25} />{shortAccountString(5, 5, $address ?? '')}
		</label>
	{/if}
</div>
<input
	type="checkbox"
	id="connect-modal-eth"
	class="modal-toggle"
	bind:checked={isConnectingModalOpen}
/>
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Connect wallet</h3>
		<label for="connect-modal-eth" class="btn btn-sm absolute right-2 top-2">✕</label>
		<div class="flex py-4 justify-center flex-col gap-2">
			<button class="btn btn-block" on:click={() => connect('metamask')}>
				<img class="mr-2" src={MetamaskLogo} alt="metamask" width={35} />
				MetaMask
			</button>

			<!-- 
				TODO: add wallet connect v2.0
				<button class="btn btn-block" on:click={() => connect('walletconnect')}>
					<img class="mr-2" src={WalletConnectLogo} alt="wallet connect" width={45} />
					WalletConnect
				</button> 
			-->
		</div>
		{#if errorMessage !== ''}
			<div class="alert alert-error shadow-lg" in:fade>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>{errorMessage}</span>
				</div>
			</div>
		{/if}
	</div>
</div>

<input
	type="checkbox"
	id="disconnect-modal-eth"
	class="modal-toggle"
	bind:checked={isDisconnectingModalOpen}
/>
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">You are going to disconnect</h3>
		<label for="disconnect-modal" class="btn btn-sm absolute right-2 top-2">✕</label>
		<div class="modal-action">
			<button class="btn btn-sm" on:click={disconnect}>Disconnect</button>
		</div>
	</div>
</div>
