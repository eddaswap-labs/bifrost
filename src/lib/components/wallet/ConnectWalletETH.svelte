<script>
	import MetamaskLogo from '$lib/images/metamask_logo.png';
	import { shortAccountString } from '$lib/pkg/utils';
	import { Ethereum } from '$lib/stores.js';

	const { connected, address } = $Ethereum;

	let isConnectingModalOpen = false;
	let isDisconnectingModalOpen = false;
	const connect = async (wallet) => {
		switch (wallet) {
			case 'metamask':
				await $Ethereum.MetaMask.connectInjected();
			case 'walletconnect':
				break;
		}
		isConnectingModalOpen = false;
	};
	const disconnect = () => {
		isDisconnectingModalOpen = false;
	};
</script>

<div>
	{#if !$connected}
		<label for="connect-modal-eth" class="btn btn-sm btn-secondary">Connect Wallet</label>
	{:else}
		<label for="disconnect-modal-eth" class="btn btn-sm btn-secondary"
			>{shortAccountString(10, 5, $address ?? '')}</label
		>
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
