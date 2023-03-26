<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	import Arrows from '$lib/images/arrows.svg';
	import CoinSelect from '$lib/components/CoinSelect.svelte';
	import { writable } from 'svelte/store';
	import { coins } from '$lib/pkg/coins';

	let ready = false;
	onMount(() => (ready = true));

	let fromCoin = writable(0);
	let toCoin = writable(1);

	let showHero = true;
	const hideHero = () => (showHero = false);

	const switchCoins = () => {
		const from = $fromCoin;
		fromCoin.set($toCoin);
		toCoin.set(from);
	};
</script>

<div class="w-full flex flex-col md:flex-row h-screen justify-center items-center">
	<div class="hero md:h-full">
		{#if showHero}
			<div class="hero-content text-left">
				{#if ready}
					<div class="max-w-xl" in:fly={{ x: -200, duration: 1500 }}>
						<h1 class="text-5xl font-bold">👾 Bifrost Protocol</h1>
						<p class="text-xl py-8">Swap assets between Ethereum, TON and Tezos with ease.</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	<div class="container flex justify-center items-center">
		{#if ready}
			<div
				class="card bg-base-200 flex flex-col items-center mx-10 p-3 w-96 border border-primary"
				in:fly={{ x: 200, duration: 1500 }}
			>
				<h4 class="text-xl mb-5 uppercase">Choose networks</h4>
				<div class="w-full">
					<p>from</p>
					<CoinSelect selectedId={fromCoin} excludedId={toCoin} />
				</div>
				<button class="mt-6 mb-1" on:click={switchCoins}
					><img src={Arrows} width={30} alt="arrows" /></button
				>
				<div class="w-full">
					<p>to</p>
					<CoinSelect selectedId={toCoin} excludedId={fromCoin} />
				</div>
				<a
					on:click={hideHero}
					class="btn btn-primary w-full mt-7"
					href={base +
						'/swap?from=' +
						coins[$fromCoin].nativeSymbol +
						'&to=' +
						coins[$toCoin].nativeSymbol}>go swap!</a
				>
			</div>
		{/if}
	</div>
</div>
