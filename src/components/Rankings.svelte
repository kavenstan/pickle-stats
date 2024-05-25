<script>
    import { formatName } from './utils';
    import Avatar from './Avatar.svelte';

    export let sortedRatings = [];
    export let recentMatches = [];

    let playerMatchCounts = {};

    $: {
        if (recentMatches.length > 0) {
            sortedRatings.forEach(player => {
                playerMatchCounts[player.player] = getPlayerMatchCount(player.player);
            });
        }
    }

    function getPlayerMatchCount(player) {
        return recentMatches.reduce((count, match) => {
            return count + (match.team1.includes(player) || match.team2.includes(player) ? 1 : 0);
        }, 0);
    }
</script>

<style>
    .rankings-container {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .ranking-row {
        display: grid;
        grid-template-columns: 0.5fr 2fr 1fr 1fr;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        align-items: center;
    }
    .ranking-row:nth-child(odd) {
        background-color: #f2f2f2;
    }
    .ranking-row:nth-child(even) {
        background-color: #ffffff;
    }
    .ranking-cell {
        padding: 5px;
    }
    .player-name {
        display: inline-block;
        cursor: pointer;
    }
    .player-name:hover {
        text-decoration: underline;
    }
    .right-align {
        text-align: right;
    }
    .no-break {
        white-space: nowrap;
    }
</style>

<div class="rankings-container">
    <h2>Rankings</h2>
    <div class="ranking-row">
        <div class="ranking-cell">#</div>
        <div class="ranking-cell">Name</div>
        <div class="ranking-cell right-align">Rating</div>
        <div class="ranking-cell right-align">Matches</div>
    </div>
    {#each sortedRatings as rating, index}
        <div class="ranking-row">
            <div class="ranking-cell">{index + 1}</div>
            <div class="ranking-cell no-break">
                <Avatar name={rating.player} size={30} />
                <a class="player-name" href={`/#/player/${rating.player}`}>{formatName(rating.player)}</a>
            </div>
            <div class="ranking-cell right-align">{rating.rating}</div>
            <div class="ranking-cell right-align">{playerMatchCounts[rating.player]}</div>
        </div>
    {/each}
</div>