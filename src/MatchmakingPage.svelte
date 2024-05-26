<script>
	import { onMount } from 'svelte';
	import { fetchRatings } from './api/api';
	import { generateMatches } from './utils/matchmaker';
	import { selectedPlayers } from './store/store';
	import { get } from 'svelte/store';
	import { updateRatings } from './utils/elo';

	let players = [];
	let playerRatings = [];
	let maxTeamAvgDiff = 200;
	let maxPlayerDiff = 200;
	let matchResults = [];
	let sittingOutPlayers = [];
	let pastMatches = [];
	let sitOutCounts = {};
	let round = 0;
	let amountCourts = 4;
	let showSettings = true;
	let showRatings = true;
	let maxExpansionRetries = 20;

	onMount(async () => {
		playerRatings = await fetchRatings();
		players = Object.keys(playerRatings)
			.map((name) => ({ name, rating: playerRatings[name] }))
			.sort((a, b) => a.name.localeCompare(b.name));

		selectedPlayers.set(new Set(players.slice(0, 14).map((player) => player.name)));
	});

	function togglePlayerSelection(player) {
		selectedPlayers.update((currentSet) => {
			const newSet = new Set(currentSet);
			if (newSet.has(player)) {
				newSet.delete(player);
			} else {
				newSet.add(player);
			}
			return newSet;
		});
	}

	function generateMatchesHandler() {
		try {
			const allSelectedPlayers = Array.from(get(selectedPlayers)).map((name) => ({
				name,
				rating: playerRatings[name]
			}));
			const result = generateMatches(
				allSelectedPlayers,
				pastMatches,
				sitOutCounts,
				maxTeamAvgDiff,
				maxPlayerDiff,
				amountCourts,
				maxExpansionRetries
			);
			matchResults = result.matches;
			sittingOutPlayers = result.sittingOutPlayers;
			round++;
			showSettings = false;
		} catch (error) {
			console.log(error);
			alert(error.message);
		}
	}

	function setMatchScore(match, team1Score, team2Score) {
		match.team1Score = team1Score ?? 0;
		match.team2Score = team2Score ?? 0;
	}

	function toggleSettings() {
		showSettings = !showSettings;
	}

	function nextRound() {
		let matchesWithResults = matchResults.filter(
			(match) => match.team1Score !== undefined || match.team2Score !== undefined
		);
		pastMatches = pastMatches.concat(matchesWithResults);

		const updatedRatings = updateRatings(matchesWithResults, playerRatings);
		playerRatings = updatedRatings;
		generateMatchesHandler();
	}

	// selectedPlayers.subscribe(($selectedPlayers) => {
	// });
</script>

<main>
	<div class="header">
		<h1>Matchmaking</h1>
		<button class="settings-button" on:click={toggleSettings}> ⚙️ </button>
	</div>
	{#if showSettings}
		<div class="settings">
			<div>
				{#each players as player}
					<span
						class="pill {$selectedPlayers.has(player.name) ? 'selected' : ''}"
						on:click={() => togglePlayerSelection(player.name)}
					>
						{player.name}
					</span>
				{/each}
			</div>
			<div>
				<label>
					Max team average rating difference:
					<input type="number" bind:value={maxTeamAvgDiff} min="10" />
				</label>
			</div>
			<div>
				<label>
					Max player rating difference:
					<input type="number" bind:value={maxPlayerDiff} min="10" />
				</label>
			</div>
			<div>
				<label>
					Max retries (Extending criteria):
					<input type="number" bind:value={maxExpansionRetries} min="0" max="50" />
				</label>
			</div>
			<div>
				<label>
					Courts:
					<input type="number" bind:value={amountCourts} min="1" max="10" />
				</label>
			</div>
			<div>
				<label>
					Show Ratings:
					<input type="checkbox" bind:checked={showRatings} />
				</label>
			</div>
		</div>
	{/if}

	{#if matchResults.length === 0}
		<button class="button" on:click={generateMatchesHandler} disabled={$selectedPlayers.size < 4}>
			Generate Matches
		</button>
	{/if}

	{#if matchResults.length > 0}
		<div>
			<h2>Round {round}</h2>
			<div class="match-grid">
				{#each matchResults as match, index}
					<div class="grid-cell court">Court {index + 1}</div>
					<div class="grid-cell team1">
						{match.team1[0].name}
						{#if showRatings}({match.team1[0].rating}){/if} <br />
						{match.team1[1].name}
						{#if showRatings}({match.team1[1].rating}){/if}
					</div>
					<div class="grid-cell score">
						<div>
							<input
								type="number"
								bind:value={match.team1Score}
								placeholder="0"
								on:change={() => setMatchScore(match, match.team1Score, match.team2Score)}
							/>
							-
							<input
								type="number"
								bind:value={match.team2Score}
								placeholder="0"
								on:change={() => setMatchScore(match, match.team1Score, match.team2Score)}
							/>
						</div>
						{#if showRatings}
							<div>Δ {match.ratingDifference.toFixed(1)}</div>
						{/if}
					</div>
					<div class="grid-cell team2">
						{match.team2[0].name}
						{#if showRatings}({match.team2[0].rating}){/if} <br />
						{match.team2[1].name}
						{#if showRatings}({match.team2[1].rating}){/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
	{#if sittingOutPlayers.length > 0}
		<div class="sitting-out">
			<h2>Sitting Out</h2>
			{#each sittingOutPlayers as player}
				<span class="pill selected">
					{player.name}
				</span>
			{/each}
		</div>
	{/if}
	<!-- {#if matchResults.length > 0 && matchResults.every((match) => match.team1Score !== undefined || match.team2Score !== undefined)} -->
	{#if matchResults.length > 0}
		<div class="next-round-container">
			<button class="button" on:click={nextRound}> Next Round </button>
		</div>
	{/if}
</main>

<style>
	.pill {
		display: inline-block;
		padding: 10px 20px;
		margin: 5px;
		border-radius: 20px;
		background-color: grey;
		color: white;
		cursor: pointer;
	}
	.pill.selected {
		background-color: skyblue;
	}
	.button {
		padding: 10px 20px;
		margin-top: 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
	.button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
	.match-grid {
		display: grid;
		grid-template-columns: 1fr 150px 1fr;
		/* gap: 10px; */
		margin-top: 20px;
	}
	.grid-cell {
		padding: 10px;
		border: 1px solid #ddd;
		text-align: center;
	}
	.court {
		grid-column: span 4;
		font-weight: bold;
	}
	.team1 {
		text-align: right;
	}
	.score {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.score input {
		width: 50px;
	}
	.team2 {
		text-align: left;
	}
	.sitting-out {
		margin-top: 20px;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.settings {
		margin-bottom: 20px;
	}
	.settings-button {
		padding: 10px;
		background-color: transparent;
		border: none;
		font-size: 24px;
		cursor: pointer;
	}
	.next-round-container {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
</style>
