<script>
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	import Arrows from '$lib/images/arrows.svg';
	import CoinSelect from '$lib/components/CoinSelect.svelte';
	import { writable } from 'svelte/store';
	import { coins } from '$lib/pkg/coins';

	import BifrostLogo from '$lib/images/bifrost_logo.svg';
	import CubeVideo from '$lib/images/cloner-cube.gif';

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

<div class="navbar bg-transparent px-5 py-2">
	<div class="navbar-start">
		<div class="dropdown">
			<label tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</label>
			<ul
				tabindex="0"
				class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li><a>docs</a></li>
				<li>
					<a target="_blank" rel="noreferrer" href="https://t.me/bifrost_defi">community</a>
				</li>
				<li>
					<a target="_blank" rel="noreferrer" href="https://github.com/bifrost-defi">GitHub</a>
				</li>
			</ul>
		</div>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1 gap-2">
			<li class="hover:text-white bg-none"><a>docs</a></li>
			<li>
				<a target="_blank" rel="noreferrer" href="https://t.me/bifrost_defi">community</a>
			</li>
			<li>
				<a target="_blank" rel="noreferrer" href="https://github.com/bifrost-defi">Github</a>
			</li>
		</ul>
	</div>
	<div class="navbar-end">
		<a class="btn btn-primary lowercase" href={base + '/bridge'}>launch app</a>
	</div>
</div>

<div class="w-full flex flex-col md:flex-row h-screen justify-center items-center">
	<div class="hero md:h-full">
		{#if showHero}
			<div class="hero-content text-left">
				{#if ready}
					<div class="max-w-xl" in:fly={{ x: -200, duration: 1500 }}>
						<div class="flex flex-row gap-5 items-center w-full">
							<img src={BifrostLogo} width={60} alt="logo" />
							<h1 class="text-4xl lowercase w-full">Bifrost Protocol</h1>
						</div>
						<h3 class="text-xl py-8 lowercase">
							Swap assets between Ethereum, TON and Tezos with ease.
						</h3>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	<div class="container flex justify-center items-center">
		<img class="w-3/4 max-w-lg" src={CubeVideo} alt="cube" />
	</div>
</div>

<div class="flex flex-col-reverse md:flex-row items-center gap-5 md:p-12 md:h-96 mb-12">
	<div class="flex justify-center w-full md:w-1/2">
		<div class="card bg-base-200 flex flex-col items-center mx-10 p-3 w-96 border border-neutral">
			<h4 class="text-xl mb-5 lowercase">Choose networks</h4>
			<div class="w-full">
				<h4>from</h4>
				<CoinSelect selectedId={fromCoin} excludedId={toCoin} />
			</div>
			<button class="mt-6 mb-1" on:click={switchCoins}
				><img src={Arrows} width={30} alt="arrows" /></button
			>
			<div class="w-full">
				<h4>to</h4>
				<CoinSelect selectedId={toCoin} excludedId={fromCoin} />
			</div>
			<a
				on:click={hideHero}
				class="btn btn-primary w-full mt-7 lowercase"
				href={base +
					'/bridge?from=' +
					coins[$fromCoin].nativeSymbol +
					'&to=' +
					coins[$toCoin].nativeSymbol}>go swap!</a
			>
		</div>
	</div>
	<div class="w-full md:w-1/2 p-10">
		<h1 class="text-4xl ">cross-chain bridge</h1>
		<p class="text-xl font-light text-gray-400 mt-5">
			We lock your coins and mint synthetic version of them on the destination blockchain. You can
			trade and transfer "wrapped" tokens and they can still be exchanged back through the bridge.
		</p>
		<p class="text-xl font-light text-gray-400 mt-5">
			Thus, all synthetic assets are pegged at 1-to-1 with an original and backed 100% by our
			smart-contracts reserves.
		</p>
	</div>
</div>

<style>
	h1,
	h2,
	h3,
	h4,
	a {
		font-family: 'Major Mono Display', monospace;
	}
</style>
