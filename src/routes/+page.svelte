<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	import Arrows from '$lib/images/arrows.svg';
	import CoinSelect from '$lib/components/CoinSelect.svelte';
	import { writable } from 'svelte/store';

	let ready = false;
	onMount(() => (ready = true));

	let fromCoin = writable(0);
	let toCoin = writable(1);

	const switchCoins = () => {
		const from = $fromCoin;
		fromCoin.set($toCoin);
		toCoin.set(from);
	};
</script>

<div class="flex flex-col md:flex-row h-screen justify-center items-center bg-base-100">
	<div class="hero md:h-full">
		<div class="hero-content text-left">
			{#if ready}
				<div class="max-w-xl" in:fly={{ x: -200, duration: 1500 }}>
					<h1 class="text-5xl font-bold">👾 Bifrost</h1>
					<p class="py-8">Swap tokens between Ethereum, TON and Tezos with ease.</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="container flex justify-center items-center">
		{#if ready}
			<div
				class="bg-base-200 shadow-xl flex flex-col items-center py-8 mx-10 px-5 w-96 border-4 border-black"
				in:fly={{ x: 200, duration: 1500 }}
			>
				<h4 class="mb-5">Wrapped Swap</h4>
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
				<a class="btn btn-primary btn-wide mt-7" href="/swap">go swap!</a>
			</div>
		{/if}
	</div>
</div>
