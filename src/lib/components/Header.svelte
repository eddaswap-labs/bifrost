<script>
	let oracleStatus = false;
</script>

<div class="navbar bg-base-100 px-5">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-2xl" href="/">👾 Bifrost</a>
	</div>
	<div class="flex-none gap-3">
		<p>Heimdallr</p>
		{#if oracleStatus}
			<span class="badge badge-success">UP</span>
		{:else}
			<span class="badge badge-error">DOWN</span>
		{/if}
	</div>
</div>
