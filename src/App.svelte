<script>
	import Router from 'svelte-spa-router';
	import { routes } from './routes';
	import MainLayout from './layout/MainLayout.svelte';
</script>

<MainLayout title="Pickle Stats">
	<main>
		<Router {routes} />
	</main>
</MainLayout>

<style global lang="postcss">
	main {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
	}
	@import './global.css';
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
