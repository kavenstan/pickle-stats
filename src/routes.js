import HomePage from './HomePage.svelte';
import PlayerPage from './PlayerPage.svelte';
import MatchmakingPage from './MatchmakingPage.svelte';

export const routes = {
	'/': HomePage,
	'/player/:player': PlayerPage,
	'/matchmaking': MatchmakingPage
};
