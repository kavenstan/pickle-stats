import HomePage from './HomePage.svelte';
import PlayerPage from './PlayerPage.svelte';
// import ResultsPage from './ResultsPage.svelte';

export const routes = {
	'/': HomePage,
	'/player/:player': PlayerPage
	// '/results': ResultsPage
};
