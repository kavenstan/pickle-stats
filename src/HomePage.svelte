
<script>
    import { onMount } from 'svelte';
	import { baseUrl } from './config';
    import Rankings from './components/Rankings.svelte';
    import Results from './components/Results.svelte';

	let playerRatings = [];
	let recentMatches = [];
	let dataLoaded = false;

	async function fetchRatings() {
		const ratingsRes = await fetch(`${baseUrl}/player_ratings.json`);
		playerRatings = await ratingsRes.json();
    }

    async function fetchMatches() {
		const matchesRes = await fetch(`${baseUrl}/match_results.json`);
		recentMatches = await matchesRes.json();
    }

	onMount(async () => {
		fetchRatings();
		fetchMatches();
		dataLoaded = true;
	});

	let sortedRatings = [];
	$: sortedRatings = Object.entries(playerRatings)
		.sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
		.map(([player, rating]) => ({ player, rating }));

</script>

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
	.rankings-container {
		min-width: 350px;
	}
    @media (max-width: 600px) {
        .rankings-container, .matches-container {
            grid-column: span 12;
        }
    }
    @media (min-width: 601px) and (max-width: 1024px) {
        .rankings-container {
            grid-column: span 5;
        }
        .matches-container {
            grid-column: span 7;
        }
    }
    @media (min-width: 1025px) {
        .rankings-container {
            grid-column: span 4;
        }
        .matches-container {
            grid-column: span 8;
        }
    }
</style>

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
