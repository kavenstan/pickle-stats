<script>
    import { onMount } from 'svelte';
    import { baseUrl } from './config';
    import MatchHistory from './components/PlayerResults.svelte';
    import Partnerships from './components/PlayerPartnerships.svelte';
    import Opponents from './components/PlayerOpponents.svelte';
    import Avatar from './components/Avatar.svelte';
    import { formatName } from './components/utils';

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
        const res = await fetch(`${baseUrl}/player_stats.json`);
        const stats = await res.json();
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
        gamesWon = matchHistory.filter(match => match.score > match.opponent_score).length;
        gamesLost = matchHistory.filter(match => match.score < match.opponent_score).length;
        gamesDrawn = matchHistory.filter(match => match.score === match.opponent_score).length;
        winPercentage = Math.round((gamesWon / totalGames) * 100);
        lossPercentage = Math.round((gamesLost / totalGames) * 100);
        drawPercentage = Math.round((gamesDrawn / totalGames) * 100);
    }
</script>

<main>
    {#if playerStats.current_rating}
        <h1><Avatar name={playerName} size={50} /> {formatName(playerName)} ({playerStats.current_rating.toFixed(0)})</h1>
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
        </section>
        <MatchHistory {matchHistory} {playerName}/>
        <Partnerships {partnerStats} />
        <Opponents {opponentStats} />
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
    .arrow-up {
        color: green;
        margin-left: 5px;
    }
    .arrow-down {
        color: red;
        margin-left: 5px;
    }
</style>
