<script>
	import '../app.css';
</script>

<div class="flex flex-col h-screen justify-between">
	<slot />

	<footer class="footer footer-center p-5 bg-base-100 text-base-content rounded">
		<div class="grid grid-flow-col gap-4">
			<a class="link link-hover" href="/">Twitter</a>
			<a class="link link-hover" href="/">Contact</a>
			<a class="link link-hover" href="/">Jobs</a>
		</div>
		<div>
			<p>&#169; {new Date().getFullYear()}</p>
		</div>
	</footer>
</div>
