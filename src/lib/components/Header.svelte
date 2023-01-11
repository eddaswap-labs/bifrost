<script>
	import MetamaskLogo from '$lib/images/metamask_logo.png';
	import WalletConnectLogo from '$lib/images/walletconnect_logo.png';
	import { shortAccountString } from '$lib/utils';

	let isConnectingModalOpen = false;
	let isDisconnectingModalOpen = false;
	const connect = () => {
		isConnectingModalOpen = false;
	};
	const disconnect = () => {
		isDisconnectingModalOpen = false;
	};
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl" href="/">👾 Bifrost</a>
	</div>
	<div class="flex-none">
		<label for="connect-modal" class="btn btn-sm btn-secondary mr-4">Connect Wallets</label>
	</div>
</div>

<input
	type="checkbox"
	id="connect-modal"
	class="modal-toggle"
	bind:checked={isConnectingModalOpen}
/>
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Connect wallet</h3>
		<label for="connect-modal" class="btn btn-sm absolute right-2 top-2">✕</label>
		<div class="flex py-4 justify-center flex-col gap-2">
			<button class="btn btn-block" on:click={connect}>
				<img class="mr-2" src={MetamaskLogo} alt="metamask" width={35} />
				MetaMask
			</button>
			<button class="btn btn-block">
				<img class="mr-2" src={WalletConnectLogo} alt="wallet connect" width={45} />
				WalletConnect
			</button>
		</div>
	</div>
</div>

<input
	type="checkbox"
	id="disconnect-modal"
	class="modal-toggle"
	bind:checked={isDisconnectingModalOpen}
/>
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">You are going to disconnect</h3>
		<label for="disconnect-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<div class="modal-action">
			<button class="btn btn-sm" on:click={disconnect}>Disconnect</button>
		</div>
	</div>
</div>
