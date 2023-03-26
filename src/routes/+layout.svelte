<script>
	import '../app.css';
	import { fly } from 'svelte/transition';

	let showAlert = true;
</script>

<div
	class="w-full flex flex-col min-h-screen justify-between bg-gradient-to-t from-base-300 to-primary/[.08]"
>
	<slot />

	<footer class="footer footer-center p-5 gap-2 text-base-content rounded">
		<div class="grid grid-flow-col gap-4">
			<a class="link link-hover" target="_blank" rel="noreferrer" href="https://t.me/bifrost_defi"
				>Telegram</a
			>
			<a
				class="link link-hover"
				target="_blank"
				rel="noreferrer"
				href="https://github.com/bifrost-defi">GitHub</a
			>
		</div>
		<div>
			<p>&#169; {new Date().getFullYear()} Bifrost</p>
		</div>
	</footer>

	{#if showAlert}
		<div class="toast" out:fly={{ x: 100, duration: 1000 }}>
			<div class="alert alert-warning">
				<div
					class="cursor-pointer"
					on:click={() => {
						showAlert = false;
					}}
				>
					✕
				</div>
				<div>
					<span>Bridge is still under development. <br /> You only see the beta release.</span>
				</div>
			</div>
		</div>
	{/if}
</div>
