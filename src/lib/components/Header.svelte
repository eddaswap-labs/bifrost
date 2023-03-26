<script>
	import BifrostLogo from '$lib/images/bifrost_logo.svg';

	export let title = 'Bifrost';

	let oracleStatus = false;
</script>

<div class="navbar px-5 py-2">
	<div class="flex-1 flex-row gap-3">
		<a href="/"><img src={BifrostLogo} width={40} alt="logo" /></a>
		<p class="normal-case text-2xl text-bold">{title}</p>
	</div>
	<div
		class="tooltip tooltip-left flex flex-row gap-3"
		data-tip="Heimdallr is our oracle. It helps to perform cross-chain operations"
	>
		<p>Heimdallr</p>
		{#if oracleStatus}
			<span class="badge badge-success">UP</span>
		{:else}
			<span class="badge badge-error">DOWN</span>
		{/if}
	</div>
</div>
