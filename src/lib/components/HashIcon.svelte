<script>
	import { hashicon } from '@emeraldpay/hashicon';
	import { onMount } from 'svelte';

	export let value;
	export let size = 100;

	let container;
	const icon = hashicon(value, size);

	onMount(() => {
		container.appendChild(icon);
	});
</script>

<span bind:this={container} />
