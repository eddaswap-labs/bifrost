<script>
	import ETHLogo from '$lib/images/eth_logo.png';
	import TZSLogo from '$lib/images/tzs_logo.svg';
	import TONLogo from '$lib/images/ton_logo.svg';
	import { writable } from 'svelte/store';

	export let coins = [
		{
			symbol: 'ETH',
			logo: ETHLogo,
			size: 20
		},
		{
			symbol: 'TZS',
			logo: TZSLogo,
			size: 20
		},
		{
			symbol: 'TON',
			logo: TONLogo,
			size: 25
		}
	];

	export let selectedId = writable(0);
	export let value = writable(0.0);

	const selectCoin = (id) => {
		selectedId.set(id);
	};
</script>

<div class="dropdown w-full">
	<label class="input-group">
		<span>
			<img class="mr-1" src={coins[$selectedId].logo} alt="logo" width={coins[$selectedId].size} />
			<svg aria-hidden="true" class="w-6 h-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/></svg
			></span
		>
		<input
			type="number"
			placeholder="0.01"
			class="input input-bordered w-full"
			min="0.0"
			step="0.01"
		/>
	</label>
	<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
		{#each coins as coin, id}
			{#if id === $selectedId}
				<li>
					<button
						class="btn-active btn-ghost"
						on:click={() => {
							selectCoin(id);
						}}
					>
						<img class="mr-2" src={coin.logo} alt="logo" width={coin.size} />
						{coin.symbol}
					</button>
				</li>
			{:else}
				<li>
					<button
						on:click={() => {
							selectCoin(id);
						}}
					>
						<img class="mr-2" src={coin.logo} alt="logo" width={coin.size} />
						{coin.symbol}
					</button>
				</li>
			{/if}
		{/each}
	</ul>
</div>
