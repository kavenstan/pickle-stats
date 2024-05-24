<script>
	import Router from 'svelte-spa-router';
	import { routes } from './routes';

	// You might want to fetch initial data here if necessary
</script>

<main>
	<h1>Pickleball Stats</h1>
	<Router {routes} />
</main>
