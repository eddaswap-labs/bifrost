<script>
	import TempleLogo from '$lib/images/temple_logo.png';
	import { shortAccountString } from '$lib/pkg/utils';
	import { writable } from 'svelte/store';
	import { connectTempleWallet } from '$lib/pkg/wallet/connectWalletTZS';

	let connected = false;
	let selectedAccount = writable('');

	let isConnectingModalOpen = false;
	let isDisconnectingModalOpen = false;
	const connect = async () => {
		selectedAccount.set(await connectTempleWallet());
		connected = true;
		isConnectingModalOpen = false;
	};
	const disconnect = () => {
		connected = false;
		isDisconnectingModalOpen = false;
	};
</script>

<div>
	{#if !connected}
		<label for="connect-modal-tzs" class="btn btn-sm btn-secondary">Connect Wallet</label>
	{:else}
		<label for="disconnect-modal-tzs" class="btn btn-sm btn-secondary"
			>{shortAccountString(10, 5, $selectedAccount ?? '')}</label
		>
	{/if}
</div>
<input
	type="checkbox"
	id="connect-modal-tzs"
	class="modal-toggle"
	bind:checked={isConnectingModalOpen}
/>
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Connect wallet</h3>
		<label for="connect-modal-tzs" class="btn btn-sm absolute right-2 top-2">✕</label>
		<div class="flex py-4 justify-center flex-col gap-2">
			<button class="btn btn-block" on:click={connect}>
				<img class="mr-2" src={TempleLogo} alt="metamask" width={25} />
				Temple Wallet
			</button>
		</div>
	</div>
</div>

<input
	type="checkbox"
	id="disconnect-modal-tzs"
	class="modal-toggle"
	bind:checked={isDisconnectingModalOpen}
/>
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">You are going to disconnect</h3>
		<label for="disconnect-modal-tzs" class="btn btn-sm absolute right-2 top-2">✕</label>
		<div class="modal-action">
			<button class="btn btn-sm" on:click={disconnect}>Disconnect</button>
		</div>
	</div>
</div>
