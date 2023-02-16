<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	import Arrows from '$lib/images/arrows.svg';
	import CoinSelect from '$lib/components/CoinSelect.svelte';
	import { writable } from 'svelte/store';
	import { coins } from '$lib/pkg/coins';
	import { send, receive } from '$lib/animations/pages.crossfade.js';

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

<div
	class="absolute w-full flex flex-col md:flex-row h-screen justify-center items-center bg-base-100"
>
	<div class="hero md:h-full">
		{#if showHero}
			<div class="hero-content text-left">
				{#if ready}
					<div class="max-w-xl" in:fly={{ x: -200, duration: 1500 }}>
						<h1 class="text-5xl font-bold">👾 Bifrost Protocol</h1>
						<p class="py-8">Swap assets between Ethereum, TON and Tezos with ease.</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	<div class="container flex justify-center items-center">
		{#if ready}
			<div
				class="bg-base-200 shadow-xl flex flex-col items-center py-8 mx-10 px-5 w-96 border-4 border-black"
				out:send={{ key: 'swap' }}
				in:receive={{ key: 'swap' }}
			>
				<h4 class="mb-5">Choose networks</h4>
				<div class="w-full">
					<p>from</p>
					<CoinSelect selectedId={fromCoin} />
				</div>
				<button class="mt-6 mb-1" on:click={switchCoins}
					><img src={Arrows} width={30} alt="arrows" /></button
				>
				<div class="w-full">
					<p>to</p>
					<CoinSelect selectedId={toCoin} />
				</div>
				<a
					on:click={hideHero}
					class="btn btn-primary btn-wide mt-7"
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
