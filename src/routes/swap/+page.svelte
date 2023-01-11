<script>
	import { onMount } from 'svelte';

	import Arrows from '$lib/images/arrows.svg';
	import CoinSelect from '$lib/components/CoinSelect.svelte';
	import { writable } from 'svelte/store';
	import Header from '../../lib/components/Header.svelte';
	import ValueInput from '../../lib/components/ValueInput.svelte';

	let ready = false;
	onMount(() => (ready = true));

	let fromCoin = writable(0);
	let toCoin = writable(1);

	let fromValue = writable(0.0);
	let toValue = writable(0.0);
</script>

<div>
	<Header />

	<div class="flex flex-col md:flex-row h-full justify-center items-center">
		<div class="container flex justify-center items-center">
			<div
				class="bg-base-200 shadow-xl flex flex-col items-center gap-5 py-8 mx-10 px-5 w-96 border-4 border-black"
			>
				<h4>Wrapped Swap</h4>
				<div class="w-full">
					<p>from</p>
					<ValueInput selectedId={fromCoin} value={fromValue} />
				</div>
				<button><img src={Arrows} width={30} alt="arrows" /></button>
				<div class="w-full">
					<p>to</p>
					<ValueInput selectedId={toCoin} value={toValue} />
				</div>
				<button class="btn btn-primary btn-wide">swap</button>
			</div>
		</div>
	</div>
</div>
