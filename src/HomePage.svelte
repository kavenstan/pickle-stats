<script>
	import { onMount } from 'svelte';
	import { baseUrl, useLocal } from './config';

	let playerRatings = [];

	console.log(`Use Local: ${useLocal}`);
	console.log(`Base URL: ${baseUrl}`);

	onMount(async () => {
		const ratingsRes = await fetch(`${baseUrl}/player_ratings.json`);
		playerRatings = await ratingsRes.json();
	});

	let sortedRatings = [];
	$: sortedRatings = Object.entries(playerRatings)
		.sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
		.map(([player, rating]) => ({ player, rating }));

	function navigateToPlayerPage(player) {
		window.location.href = `/#/player/${player}`;
	}
</script>

<main>
	<h1>Pickleball Stats</h1>
	<section>
		<h2>Latest Ratings</h2>
		<ul>
			{#each sortedRatings as { player, rating }}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={() => navigateToPlayerPage(player)}>
					{player}: {rating}
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		padding: 10px;
		margin: 5px 0;
		background-color: #f0f0f0;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	li:hover {
		background-color: #e0e0e0;
	}
</style>
