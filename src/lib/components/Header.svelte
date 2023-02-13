<script>
	let oracleStatus = false;
</script>

<div class="navbar bg-base-100 px-5">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-2xl" href="/">👾 Bifrost</a>
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
