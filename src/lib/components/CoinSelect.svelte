<script>
	import { coins } from '$lib/pkg/coins';
	import { writable } from 'svelte/store';

	export let selectedId = writable(0);

	const selectCoin = (id) => {
		selectedId.set(id);
	};
</script>

<div class="dropdown w-full">
	<label
		tabindex="0"
		class="btn flex-shrink-0 z-10 inline-flex items-center justify-between border border-black text-sm font-medium text-center text-gray-500 bg-base-100 w-full h-12"
	>
		<div class="flex flex-row gap-3 items-center">
			<img src={coins[$selectedId].logo} alt="" width={coins[$selectedId].logoSize} />
			{coins[$selectedId].nativeSymbol}
		</div>
		<svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/></svg
		>
	</label>
	<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 w-full border border-black">
		{#each coins as coin, id}
			{#if id !== $selectedId}
				<li>
					<button
						on:click={() => {
							selectCoin(id);
						}}
					>
						<img class="mr-2" src={coin.logo} alt="logo" width={coin.logoSize} />
						{coin.nativeSymbol}
					</button>
				</li>
			{/if}
		{/each}
	</ul>
</div>
