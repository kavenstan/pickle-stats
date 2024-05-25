<script>
	export let matchHistory = [];
	export let playerName = '';
	// import Avatar from './Avatar.svelte';
	import { isNewDate, getResultColor } from './utils';
</script>

<div class="match-container">
	<h2>Match History</h2>
	{#each matchHistory.reverse() as match, index}
		{#if isNewDate(index, matchHistory)}
			<div class="date-row">{match.date}</div>
		{/if}
		<div class="match-row">
			<div class="match-cell no-break right-align">
				{playerName}
				<!-- <Avatar name={playerName} size={20} /> -->
				<br />
				<a class="player-name" href={`/#/player/${match.partner}`}>{match.partner}</a>
				<!-- <Avatar name={match.partner} size={20} /> -->
			</div>
			<div
				class="match-cell match-result"
				style="--color-left-rgb: {getResultColor(
					match.score,
					match.opponent_score
				)[0]}; --color-right-rgb: {getResultColor(match.score, match.opponent_score)[1]}"
			>
				<span>{match.score} - {match.opponent_score}</span>
			</div>
			<div class="match-cell no-break">
				{#each match.opponents as opponent}
					<span>
						<!-- <Avatar name={opponent} size={20} /> -->
						<a class="player-name" href={`/#/player/${opponent}`}>{opponent}</a>
					</span><br />
				{/each}
			</div>
			<div class="match-cell">{match.rating}</div>
			<div class="match-cell rating-change">
				{match.rating_change}
				{#if match.rating_change > 0}
					<span class="arrow-up">▲</span>
				{:else if match.rating_change < 0}
					<span class="arrow-down">▼</span>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.match-container {
		background: #f9f9f9;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
	.match-row {
		display: grid;
		grid-template-columns: 2fr 60px 2fr 44px 44px;
		padding: 4px;
		border-bottom: 1px solid #ddd;
		align-items: center;
	}
	.match-row:nth-child(odd) {
		background-color: #f2f2f2;
	}
	.match-row:nth-child(even) {
		background-color: #ffffff;
	}
	.match-cell {
		padding: 5px;
	}
	.match-result {
		text-align: center;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;
	}
	.match-result::before,
	.match-result::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 10px;
	}
	.match-result::before {
		left: 0;
		background: linear-gradient(
			to right,
			rgba(var(--color-left-rgb), 0.5),
			rgba(var(--color-left-rgb), 0)
		);
	}
	.match-result::after {
		right: 0;
		background: linear-gradient(
			to left,
			rgba(var(--color-right-rgb), 0.5),
			rgba(var(--color-right-rgb), 0)
		);
	}
	.rating-change {
		display: flex;
		justify-content: end;
	}
	.arrow-up {
		color: green;
		margin-left: 5px;
	}
	.arrow-down {
		color: red;
		margin-left: 5px;
	}
	.no-break {
		white-space: nowrap;
	}
	.right-align {
		text-align: right;
	}
	.date-row {
		grid-column: span 12;
		text-align: center;
		font-weight: bold;
		padding: 10px 0;
	}
</style>
