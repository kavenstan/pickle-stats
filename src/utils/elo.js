const K = 32;

function expectedScore(rating1, rating2) {
    return 1 / (1 + 10 ** ((rating2 - rating1) / 400));
}

export function updateRatings(roundResults, currentRatings, useScoreDifference = false) {
    const updatedRatings = { ...currentRatings };

    const formattedResults = roundResults.map(match => ({
        player1_team1: match.team1[0].name,
        player2_team1: match.team1[1].name,
        player1_team2: match.team2[0].name,
        player2_team2: match.team2[1].name,
        score_team1: match.team1Score ?? 0,
        score_team2: match.team2Score ?? 0
    }));

    formattedResults.forEach(result => {
        const { player1_team1, player2_team1, player1_team2, player2_team2, score_team1, score_team2 } = result;

        const team1_rating = (updatedRatings[player1_team1] + updatedRatings[player2_team1]) / 2;
        const team2_rating = (updatedRatings[player1_team2] + updatedRatings[player2_team2]) / 2;

        const exp_team1 = expectedScore(team1_rating, team2_rating);
        const exp_team2 = expectedScore(team2_rating, team1_rating);

        let actual_team1, actual_team2;
        if (score_team1 > score_team2) {
            actual_team1 = 1;
            actual_team2 = 0;
        } else if (score_team1 < score_team2) {
            actual_team1 = 0;
            actual_team2 = 1;
        } else {
            actual_team1 = 0.5;
            actual_team2 = 0.5;
        }

        const score_diff = Math.abs(score_team1 - score_team2);
        let team1_rating_change, team2_rating_change;
        if (useScoreDifference) {
            const impact_factor = 1 + (score_diff / 10);
            team1_rating_change = impact_factor * K * (actual_team1 - exp_team1);
            team2_rating_change = impact_factor * K * (actual_team2 - exp_team2);
        } else {
            team1_rating_change = K * (actual_team1 - exp_team1);
            team2_rating_change = K * (actual_team2 - exp_team2);
        }

        [player1_team1, player2_team1].forEach(player => {
            const playerImpact = updatedRatings[player] / team1_rating;
            const ratingChange = Math.round(team1_rating_change * playerImpact);
            console.log("Rating Change:", player, ratingChange);
            updatedRatings[player] += ratingChange;
        });

        [player1_team2, player2_team2].forEach(player => {
            const playerImpact = updatedRatings[player] / team2_rating;
            const ratingChange = Math.round(team2_rating_change * playerImpact);
            console.log("Rating Change:", player, ratingChange);
            updatedRatings[player] += ratingChange;
        });
    });

    return updatedRatings;
}