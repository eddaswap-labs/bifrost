<script>
	import BifrostLogo from '$lib/images/bifrost_logo.svg';

	export let title = 'Bifrost';

	let oracleStatus = false;
</script>

<div class="navbar px-5 py-2">
	<div class="flex-1 flex-row gap-3">
		<a href="/"><img src={BifrostLogo} width={40} alt="logo" /></a>
		<h2 class="text-2xl text-bold lowercase">{title}</h2>
	</div>
	<div
		class="tooltip tooltip-left flex flex-row gap-3"
		data-tip="Heimdallr is our oracle. It helps to perform cross-chain operations"
	>
		<p>heimdallr</p>
		{#if oracleStatus}
			<span class="badge badge-success">UP</span>
		{:else}
			<span class="badge badge-error">DOWN</span>
		{/if}
	</div>
</div>

<style>
	h1,
	h2,
	h3,
	h4,
	p {
		font-family: 'Major Mono Display', monospace;
	}
</style>
