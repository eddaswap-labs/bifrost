<script>
	import '../app.css';
</script>

<div class="flex flex-col min-h-screen justify-between">
	<slot />

	<footer class="footer footer-center p-5 bg-base-100 gap-2 text-base-content rounded">
		<div class="grid grid-flow-col gap-4">
			<a class="link link-hover" target="_blank" rel="noreferrer" href="https://t.me/bifrost_defi"
				>Telegram</a
			>
		</div>
		<div>
			<p>&#169; {new Date().getFullYear()} Bifrost</p>
		</div>
	</footer>

	<div class="toast">
		<div class="alert alert-warning">
			<div>
				<span>Bridge is still under development. <br /> You only see the beta release.</span>
			</div>
		</div>
	</div>
</div>
