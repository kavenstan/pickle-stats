<script>
	import { onMount } from 'svelte';
	import { baseUrl } from './config';
	export let params;

	let playerStats = {};
	let matchHistory = [];
	let playerName = params.player;

	let partnerStats = [];
	let opponentStats = [];

	onMount(async () => {
		const res = await fetch(`${baseUrl}/player_stats.json`);
		const stats = await res.json();
		playerStats = stats[playerName] || {};
		matchHistory = playerStats.rating_history || [];
		calculateAverageStats();
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
</script>

<main>
	{#if playerStats.current_rating}
		<h1>{playerName} ({playerStats.current_rating.toFixed(0)})</h1>
		<section>
			<h2>Match History</h2>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Partner</th>
						<th>Score</th>
						<th>Opponents</th>
						<th>Rating</th>
						<th>Change</th>
					</tr>
				</thead>
				<tbody>
					{#each matchHistory.reverse() as match}
						<tr>
							<td>{match.date}</td>
							<td>{match.partner}</td>
							<td>{match.score} - {match.opponent_score}</td>
							<td>{match.opponents.join(', ')}</td>
							<td>{match.rating}</td>
							<td>{match.rating_change}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
		<section>
			<h2>Partnerships</h2>
			<table>
				<thead>
					<tr>
						<th>Partner</th>
						<th>Games Played</th>
						<th>Average Rating Change</th>
						<th>Total Rating Change</th>
					</tr>
				</thead>
				<tbody>
					{#each partnerStats as { partner, games, totalGain, averageGain }}
						<tr>
							<td>{partner}</td>
							<td>{games}</td>
							<td>{averageGain.toFixed(2)}</td>
							<td>{totalGain.toFixed(0)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
		<section>
			<h2>Opponents</h2>
			<table>
				<thead>
					<tr>
						<th>Opponent</th>
						<th>Games Played</th>
						<th>Average Rating Change</th>
						<th>Total Rating Change</th>
					</tr>
				</thead>
				<tbody>
					{#each opponentStats as { opponent, games, totalLoss, averageLoss }}
						<tr>
							<td>{opponent}</td>
							<td>{games}</td>
							<td>{averageLoss.toFixed(2)}</td>
							<td>{totalLoss.toFixed(0)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{:else}
		<p>No data available for {playerName}.</p>
	{/if}
</main>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 20px;
	}
	th,
	td {
		padding: 10px;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}
	th {
		background-color: #f2f2f2;
	}
	tr:hover {
		background-color: #f5f5f5;
	}
</style>
