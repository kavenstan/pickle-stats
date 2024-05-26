<script>
	import { onMount } from 'svelte';
	import { fetchRatings, fetchMatches } from './api/api';
	import { sortByRating } from './utils/utils';
	import Rankings from './components/Rankings.svelte';
	import Results from './components/Results.svelte';

	let playerRatings = [];
	let recentMatches = [];
	let dataLoaded = false;

	onMount(async () => {
		playerRatings = await fetchRatings();
		recentMatches = await fetchMatches();
		dataLoaded = true;
	});

	let sortedRatings = [];
	$: sortedRatings = sortByRating(playerRatings);
</script>

<main>
	<h1>Pickle Stats</h1>
	<div class="grid-container">
		{#if dataLoaded}
			<div class="rankings-container">
				<Rankings {sortedRatings} {recentMatches} />
			</div>
			<div class="matches-container">
				<Results {recentMatches} />
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		padding: 20px;
	}
	h1 {
		text-align: center;
	}
	.grid-container {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 20px;
	}
	@media (max-width: 600px) {
		.rankings-container,
		.matches-container {
			grid-column: span 12;
		}
	}
	@media (min-width: 601px) and (max-width: 1024px) {
		.rankings-container {
			grid-column: span 6;
		}
		.matches-container {
			grid-column: span 6;
		}
	}
	@media (min-width: 1025px) {
		.rankings-container {
			grid-column: span 6;
		}
		.matches-container {
			grid-column: span 6;
		}
	}
</style>
