<script>
    export let opponentStats = [];
</script>

<style>
    .opponents-container {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .opponent-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        align-items: center;
    }
    .opponent-row:nth-child(odd) {
        background-color: #f2f2f2;
    }
    .opponent-row:nth-child(even) {
        background-color: #ffffff;
    }
    .opponent-cell {
        padding: 5px;
    }
</style>

<div class="opponents-container">
    <h2>Opponents</h2>
    <div class="opponent-row">
        <div class="opponent-cell">Opponent</div>
        <div class="opponent-cell">Games Played</div>
        <div class="opponent-cell">Average Rating Change</div>
        <div class="opponent-cell">Total Rating Change</div>
    </div>
    {#each opponentStats as { opponent, games, totalLoss, averageLoss }}
        <div class="opponent-row">
            <div class="opponent-cell">{opponent}</div>
            <div class="opponent-cell">{games}</div>
            <div class="opponent-cell">{averageLoss.toFixed(2)}</div>
            <div class="opponent-cell">{totalLoss.toFixed(0)}</div>
        </div>
    {/each}
</div>
