<script>
    export let partnerStats = [];
</script>

<style>
    .partnerships-container {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .partnership-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        align-items: center;
    }
    .partnership-row:nth-child(odd) {
        background-color: #f2f2f2;
    }
    .partnership-row:nth-child(even) {
        background-color: #ffffff;
    }
    .partnership-cell {
        padding: 5px;
    }
</style>

<div class="partnerships-container">
    <h2>Partnerships</h2>
    <div class="partnership-row">
        <div class="partnership-cell">Partner</div>
        <div class="partnership-cell">Games Played</div>
        <div class="partnership-cell">Average Rating Change</div>
        <div class="partnership-cell">Total Rating Change</div>
    </div>
    {#each partnerStats as { partner, games, totalGain, averageGain }}
        <div class="partnership-row">
            <div class="partnership-cell">{partner}</div>
            <div class="partnership-cell">{games}</div>
            <div class="partnership-cell">{averageGain.toFixed(2)}</div>
            <div class="partnership-cell">{totalGain.toFixed(0)}</div>
        </div>
    {/each}
</div>
