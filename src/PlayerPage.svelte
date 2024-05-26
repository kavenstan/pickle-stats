<script>
	import { onMount } from 'svelte';
	import { baseUrl } from './utils/config';
	import MatchHistory from './components/PlayerResults.svelte';
	import Partnerships from './components/PlayerPartnerships.svelte';
	import Opponents from './components/PlayerOpponents.svelte';
	import Avatar from './components/Avatar.svelte';
	import { formatName } from './utils/utils';
	import { fetchPlayerStats } from './api/api';

	export let params;

	let playerStats = {};
	let matchHistory = [];
	let playerName = params.player;

	let partnerStats = [];
	let opponentStats = [];

	let totalGames = 0;
	let gamesWon = 0;
	let gamesLost = 0;
	let gamesDrawn = 0;
	let winPercentage = 0;
	let lossPercentage = 0;
	let drawPercentage = 0;

	onMount(async () => {
		const stats = await fetchPlayerStats();
		playerStats = stats[playerName] || {};
		matchHistory = playerStats.rating_history || [];
		calculateAverageStats();
		calculateMatchStats();
	});

	function calculateAverageStats() {
		let tempPartnerStats = {};
		let tempOpponentStats = {};

		matchHistory.forEach((match) => {
			const { rating_change, partner, opponents } = match;

			// Track stats for partner
			if (!tempPartnerStats[partner]) {
				tempPartnerStats[partner] = { games: 0, totalGain: 0 };
			}
			tempPartnerStats[partner].games += 1;
			tempPartnerStats[partner].totalGain += rating_change;

			// Track stats for opponents
			opponents.forEach((opponent) => {
				if (!tempOpponentStats[opponent]) {
					tempOpponentStats[opponent] = { games: 0, totalLoss: 0 };
				}
				tempOpponentStats[opponent].games += 1;
				tempOpponentStats[opponent].totalLoss += rating_change;
			});
		});

		partnerStats = Object.entries(tempPartnerStats)
			.map(([partner, stats]) => ({
				partner,
				games: stats.games,
				totalGain: stats.totalGain,
				averageGain: stats.totalGain / stats.games
			}))
			.sort((a, b) => b.averageGain - a.averageGain);

		opponentStats = Object.entries(tempOpponentStats)
			.map(([opponent, stats]) => ({
				opponent,
				games: stats.games,
				totalLoss: stats.totalLoss,
				averageLoss: stats.totalLoss / stats.games
			}))
			.sort((a, b) => a.averageLoss - b.averageLoss);
	}

	function calculateMatchStats() {
		totalGames = matchHistory.length;
		gamesWon = matchHistory.filter((match) => match.score > match.opponent_score).length;
		gamesLost = matchHistory.filter((match) => match.score < match.opponent_score).length;
		gamesDrawn = matchHistory.filter((match) => match.score === match.opponent_score).length;
		winPercentage = Math.round((gamesWon / totalGames) * 100);
		lossPercentage = Math.round((gamesLost / totalGames) * 100);
		drawPercentage = Math.round((gamesDrawn / totalGames) * 100);
	}
</script>

<main>
	{#if playerStats.current_rating}
		<h1>
			<Avatar name={playerName} size={50} />
			{formatName(playerName)} ({playerStats.current_rating.toFixed(0)})
		</h1>
		<section>
			<h2>Match Stats</h2>
			<div>Played: {totalGames}</div>
			<div>Won: {gamesWon} ({winPercentage}%)</div>
			<div>Lost: {gamesLost} ({lossPercentage}%)</div>
			<div>Drawn: {gamesDrawn} ({drawPercentage}%)</div>
			<!-- <div>
                Form: 
                {#each matchHistory.slice(-10) as match}
                    {#if match.score > match.opponent_score}
                        <span class="arrow-up">▲</span>
                    {:else if match.score < match.opponent_score}
                        <span class="arrow-down">▼</span>
                    {/if}
                {/each}
            </div> -->
			<br />
		</section>
		<div class="grid-container">
			<div class="match-container">
				<MatchHistory {matchHistory} {playerName} />
			</div>
			<div class="partnerships-container">
				<Partnerships {partnerStats} />
			</div>
			<div class="opponents-container">
				<Opponents {opponentStats} />
			</div>
		</div>
	{:else}
		<p>No data available for {playerName}.</p>
	{/if}
</main>

<style>
	main {
		padding: 20px;
	}
	h1 {
		text-align: center;
		margin-bottom: 20px;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 20px;
	}
	@media (max-width: 600px) {
		.match-container,
		.partnerships-container {
			grid-column: span 12;
		}
		.opponents-container {
			grid-column: span 12;
		}
	}
	@media (min-width: 601px) and (max-width: 1024px) {
		.match-container {
			grid-column: span 6;
		}
		.partnerships-container {
			grid-column: span 6;
		}
		.opponents-container {
			grid-column: span 6;
		}
	}
	@media (min-width: 1025px) {
		.match-container {
			grid-column: span 4;
		}
		.partnerships-container {
			grid-column: span 4;
		}
		.opponents-container {
			grid-column: span 4;
		}
	}

	/* .arrow-up {
		color: green;
		margin-left: 5px;
	}
	.arrow-down {
		color: red;
		margin-left: 5px;
	} */
</style>
