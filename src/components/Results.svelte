<script>
    import Avatar from './Avatar.svelte';
    export let recentMatches = [];

    function isNewDate(index, matches) {
        if (index === 0) return true;
        return matches[index].date !== matches[index - 1].date;
    }

    function getResultColor(score1, score2) {
        if (score1 > score2) return ['#008800', '#880000'];
        if (score1 < score2) return ['#880000', '#008800'];
        return ['#888800', '#888800'];
    }
</script>

<style>
    .matches-container {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .match-row {
        display: grid;
        grid-template-columns: 1fr minmax(80px, auto) 1fr;
        padding: 10px;
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
    .date-row {
        grid-column: span 12;
        text-align: center;
        font-weight: bold;
        padding: 10px 0;
    }
    .match-result {
        text-align: center;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 80px;
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
        background: linear-gradient(to right, var(--color-left), transparent);
    }

    .match-result::after {
        right: 0;
        background: linear-gradient(to left, var(--color-right), transparent);
    }
    .no-break {
        white-space: nowrap;
    }
</style>

<div class="matches-container">
    <h2>Recent Results</h2>
    {#each recentMatches.slice(0, 100) as match, index}
        {#if isNewDate(index, recentMatches)}
            <div class="date-row">{match.date}</div>
        {/if}
        <div class="match-row">
            <div class="match-cell no-break right-align">
                <a class="player-name" href={`/#/player/${match.team1[0]}`}>{match.team1[0].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</a>
                <Avatar name={match.team1[0]} size={20} />
                <br>
                <a class="player-name" href={`/#/player/${match.team1[1]}`}>{match.team1[1].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</a>
                <Avatar name={match.team1[1]} size={20} />
            </div>
            <div class="match-cell match-result" style="--color-left: {getResultColor(match.score_team1, match.score_team2)[0]}; --color-right: {getResultColor(match.score_team1, match.score_team2)[1]}">
                <span>{match.score_team1}-{match.score_team2}</span>
            </div>
            <div class="match-cell no-break">
                <Avatar name={match.team2[0]} size={20} />
                <a class="player-name" href={`/#/player/${match.team2[0]}`}>{match.team2[0].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</a>
                <br>
                <Avatar name={match.team2[1]} size={20} />
                <a class="player-name" href={`/#/player/${match.team2[1]}`}>{match.team2[1].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</a>
            </div>
        </div>
    {/each}
</div>
