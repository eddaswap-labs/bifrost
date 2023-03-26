<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import Arrows from '$lib/images/arrows.svg';
	import ArrowRight from '$lib/images/arrowRight.svg';
	import CoinSelect from '$lib/components/CoinSelect.svelte';
	import { writable } from 'svelte/store';
	import Header from '$lib/components/Header.svelte';
	import { bigIntToFloat } from '$lib/pkg/utils';
	import { coins } from '$lib/pkg/coins';
	import ConnectWalletETH from '$lib/components/wallet/ConnectWalletETH.svelte';
	import ConnectWalletTZS from '$lib/components/wallet/ConnectWalletTZS.svelte';
	import ConnectWalletTON from '$lib/components/wallet/ConnectWalletTON.svelte';
	import { send, receive } from '$lib/animations/pages.crossfade.js';
	import { fade } from 'svelte/transition';

	let ready = false;
	onMount(() => (ready = true));

	let fromSymbol = $page.url.searchParams.get('from');
	let toSymbol = $page.url.searchParams.get('to');

	let fromNetwork = writable(
		fromSymbol ? coins.findIndex((c) => c.nativeSymbol === fromSymbol) : 0
	);
	let toNetwork = writable(toSymbol ? coins.findIndex((c) => c.nativeSymbol === toSymbol) : 1);

	let assetPair = 0;

	let fromValue = '';
	let toValue = '';

	const switchCoins = () => {
		const from = $fromNetwork;
		fromNetwork.set($toNetwork);
		toNetwork.set(from);
	};

	let swapFee = bigIntToFloat(0, 18, 9);
</script>

<Header />

<div class="flex flex-col md:flex-row h-full justify-center items-center px-5 md:px-0">
	<div
		class="card bg-base-300 flex flex-col items-center p-2 w-full md:w-1/3 border border-neutral"
		in:fade
	>
		<h4 class="text-xl p-2 w-full text-left uppercase">Synthetic Swap</h4>
		<div class="flex flex-row justify-between gap-2 w-full bg-base-100 rounded-xl p-5">
			<div class="w-6/12">
				<input
					type="number"
					placeholder="0"
					class="input input-lg input-ghost text-4xl focus:bg-transparent w-full !outline-none p-0"
					min="0.000"
					step="0.001"
					bind:value={fromValue}
				/>
			</div>
			<div class="flex flex-col gap-3 w-5/12">
				<div>
					<CoinSelect selectedId={fromNetwork} excludedId={toNetwork} />
				</div>
				{#if $fromNetwork === 0}
					<ConnectWalletETH />
				{:else if $fromNetwork === 1}
					<ConnectWalletTZS />
				{:else if $fromNetwork === 2}
					<ConnectWalletTON />
				{/if}
			</div>
		</div>
		<button
			class="-my-4 z-20 bg-base-100 border-4 border-base-300 rounded-lg"
			on:click={switchCoins}><img src={Arrows} width={30} alt="arrows" /></button
		>
		<div class="flex flex-row justify-between gap-2 w-full bg-base-100 rounded-xl p-5">
			<div class="w-6/12">
				<input
					type="number"
					placeholder="0"
					class="input input-lg input-ghost text-4xl focus:bg-transparent w-full !outline-none p-0"
					min="0.000"
					step="0.001"
					bind:value={toValue}
				/>
			</div>
			<div class="flex flex-col gap-3 w-5/12">
				<div>
					<CoinSelect selectedId={toNetwork} excludedId={fromNetwork} />
				</div>
				{#if $toNetwork === 0}
					<ConnectWalletETH />
				{:else if $toNetwork === 1}
					<ConnectWalletTZS />
				{:else if $toNetwork === 2}
					<ConnectWalletTON />
				{/if}
			</div>
		</div>
		<div class="flex flex-row justify-between w-80 mt-5">
			<div class="btn-group">
				<input
					type="button"
					name="from-options"
					value={coins[$toNetwork].syntheticSymbol}
					class={'btn btn-sm normal-case ' + (assetPair === 0 ? 'btn-primary' : 'btn-outline')}
					on:click={() => (assetPair = 0)}
				/>
				<input
					type="button"
					name="from-options"
					value={coins[$fromNetwork].nativeSymbol}
					class={'btn btn-sm normal-case	' + (assetPair === 1 ? 'btn-primary' : 'btn-outline')}
					on:click={() => (assetPair = 1)}
				/>
			</div>

			<img src={ArrowRight} width={30} alt="arrows" />

			<div class="btn-group">
				<input
					type="button"
					name="to-options"
					value={coins[$toNetwork].nativeSymbol}
					class={'btn btn-sm normal-case ' + (assetPair === 0 ? 'btn-primary' : 'btn-outline')}
					on:click={() => (assetPair = 0)}
				/>
				<input
					type="button"
					name="to-options"
					value={coins[$fromNetwork].syntheticSymbol}
					class={'btn btn-sm normal-case ' + (assetPair === 1 ? 'btn-primary' : 'btn-outline')}
					on:click={() => (assetPair = 1)}
				/>
			</div>
		</div>
		<div class="flex flex-col gap-2 w-full px-2 mt-5">
			<div class="flex flex-row justify-between">
				<p>Swap fee</p>
				<p>{swapFee}</p>
			</div>
		</div>
		<button class="btn btn-primary btn-full w-full mt-5">swap</button>
	</div>
</div>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
