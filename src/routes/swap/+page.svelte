<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import Arrows from '$lib/images/arrows.svg';
	import CoinSelect from '$lib/components/CoinSelect.svelte';
	import { writable } from 'svelte/store';
	import Header from '$lib/components/Header.svelte';
	import { bigIntToFloat } from '$lib/pkg/utils';
	import { coins } from '$lib/pkg/coins';
	import ConnectWalletETH from '$lib/components/wallet/ConnectWalletETH.svelte';
	import ConnectWalletTZS from '$lib/components/wallet/ConnectWalletTZS.svelte';
	import ConnectWalletTON from '$lib/components/wallet/ConnectWalletTON.svelte';

	let ready = false;
	onMount(() => (ready = true));

	let fromSymbol = $page.url.searchParams.get('from');
	let toSymbol = $page.url.searchParams.get('to');

	let fromCoin = writable(fromSymbol ? coins.findIndex((c) => c.symbol === fromSymbol) : 0);
	let toCoin = writable(toSymbol ? coins.findIndex((c) => c.symbol === toSymbol) : 1);

	let fromValue = writable(0.0);
	let toValue = writable(0.0);

	const switchCoins = () => {
		const from = $fromCoin;
		fromCoin.set($toCoin);
		toCoin.set(from);
	};

	let swapFee = bigIntToFloat(0, 18, 18);
</script>

<Header />

<div class="flex flex-col md:flex-row h-full justify-center items-center px-5 md:px-0">
	<div
		class="bg-base-200 shadow-sm flex flex-col items-center py-8 px-5 w-full md:w-1/3 border-4 border-black"
	>
		<h4 class="mb-5">Wrapped Swap</h4>
		<div class="w-full">
			<p>from</p>
			<div class="flex flex-row justify-between items-center my-3">
				<div class="w-1/3">
					<CoinSelect bind:selectedId={fromCoin} />
				</div>
				{#if $fromCoin === 0}
					<ConnectWalletETH />
				{:else if $fromCoin === 1}
					<ConnectWalletTZS />
				{:else if $fromCoin === 2}
					<ConnectWalletTON />
				{/if}
			</div>
			<input
				type="number"
				placeholder="0.001"
				class="input input-bordered border-black w-full"
				min="0.000"
				step="0.001"
			/>
		</div>
		<button class="mt-6 mb-1" on:click={switchCoins}
			><img src={Arrows} width={30} alt="arrows" /></button
		>
		<div class="w-full">
			<p>to</p>
			<div class="flex flex-row justify-between items-center my-3">
				<div class="w-1/3">
					<CoinSelect bind:selectedId={toCoin} />
				</div>
				{#if $toCoin === 0}
					<ConnectWalletETH />
				{:else if $toCoin === 1}
					<ConnectWalletTZS />
				{:else if $toCoin === 2}
					<ConnectWalletTON />
				{/if}
			</div>
			<input
				type="number"
				placeholder="0.001"
				class="input input-bordered border-black w-full"
				min="0.000"
				step="0.001"
			/>
		</div>
		<div class="flex flex-col gap-2 w-full px-2 mt-5">
			<div class="flex flex-row justify-between">
				<p>Swap fee</p>
				<p>{swapFee}</p>
			</div>
		</div>
		<button class="btn btn-primary btn-wide mt-5">swap</button>
	</div>
</div>
