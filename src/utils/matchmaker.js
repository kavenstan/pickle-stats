export function generateMatches(players, pastMatches, sitOutCounts, maxTeamAvgDiff, maxPlayerDiff, amountCourts, minIterations = 1000, maxIterations = 1000) {
    if (players.length < 4) {
        throw new Error('Not enough players to generate matches.');
    }
    if (minIterations >= maxIterations) {
        minIterations = maxIterations - 1;
    }

    let iterations = 0;
    let iterationRetries = 0;
    let maxIterationRetries = 10;
    let matches = [];
    let smallestRatingDifference = Infinity;

    let places = amountCourts * 4;
    let amountSitOuts = players.length > places ? players.length - places : players.length % 4;

    let roundPlayers = players;
    let sittingOutPlayers = [];

    // console.table(sitOutCounts);

    // this could have somone sit out twice in a row - if they join later, or when it loops around
    // instead we could look at ordering the list based on the last round that they sat out
    if (amountSitOuts > 0) {
        const shuffledAllPlayers = [...players].sort(() => Math.random() - 0.5);
        const sortedPlayers = shuffledAllPlayers.sort((a, b) => (sitOutCounts[a.name] || 0) - (sitOutCounts[b.name] || 0));
        sittingOutPlayers = sortedPlayers.slice(0, amountSitOuts);
        roundPlayers = sortedPlayers.slice(amountSitOuts);
    }

    // console.log("Sitting Out", sittingOutPlayers.map(x => x.name).join(", "));

    while (iterations < maxIterations) {
        const shuffledPlayers = [...roundPlayers].sort(() => Math.random() - 0.5);

        const potentialMatches = findMatches(shuffledPlayers, amountCourts);

        if (potentialMatches.every(match => match.ratingDifference <= maxTeamAvgDiff && teamsAreValid(match, maxPlayerDiff) && !teamPlayedTogether(pastMatches, match.team1, match.team2))) {

            // smallest difference between ranges
            // const ratingDifferences = potentialMatches.map(match => match.ratingDifference);
            // const maxRatingDifference = Math.max(...ratingDifferences);
            // const minRatingDifference = Math.min(...ratingDifferences);
            // const differenceRange = maxRatingDifference - minRatingDifference;

            // smallest total rating difference
            const differenceRange = potentialMatches.reduce((sum, match) => sum + match.ratingDifference, 0);


            if (differenceRange < smallestRatingDifference) {
                console.log("New best difference", differenceRange);
                smallestRatingDifference = differenceRange;
                matches = potentialMatches;
            }
        }

        iterations++;

        if (iterations >= minIterations && matches.length > 0) {
            break;
        }

        if (iterations == maxIterations) {
            if (iterationRetries < maxIterationRetries) {
                console.log("Broadening Search Criteria... (+10)");
                iterations = 0;
                maxTeamAvgDiff += 10;
                maxPlayerDiff += 10;
            }
            iterationRetries++;
        }

    }

    console.log("Iterations", iterations);

    if (iterations >= maxIterations) {
        throw new Error('Failed to generate matches within the specified criteria.');
    }

    sittingOutPlayers.forEach(player => {
        if (sitOutCounts[player.name] === undefined) {
            sitOutCounts[player.name] = 0;
        }
        sitOutCounts[player.name]++;
    });

    return { matches, sittingOutPlayers };
}

function getAverageRating(players) {
    const totalRating = players.reduce((sum, player) => sum + player.rating, 0);
    return totalRating / players.length;
}

function isValidTeam(team, maxPlayerDiff) {
    return Math.abs(team[0].rating - team[1].rating) <= maxPlayerDiff;
}

function teamsAreValid(match, maxPlayerDiff) {
    return isValidTeam(match.team1, maxPlayerDiff) && isValidTeam(match.team2, maxPlayerDiff);
}

function teamPlayedTogether(pastMatches, team1, team2) {
    for (const match of pastMatches) {
        const team1Names = team1.map(player => player.name).sort().join(',');
        const team2Names = team2.map(player => player.name).sort().join(',');
        const pastTeam1Names = match.team1.map(player => player.name).sort().join(',');
        const pastTeam2Names = match.team2.map(player => player.name).sort().join(',');
        if ((team1Names === pastTeam1Names || team2Names === pastTeam2Names) ||
            (team1Names === pastTeam2Names || team2Names === pastTeam1Names)) {
            return true;
        }
    }
    return false;
}

function createMatch(team1, team2) {
    const team1Average = getAverageRating(team1);
    const team2Average = getAverageRating(team2);
    const ratingDifference = Math.abs(team1Average - team2Average);

    return {
        team1,
        team2,
        team1Average,
        team2Average,
        ratingDifference
    };
}

function findMatches(players, amountCourts) {
    const teams = [];
    for (let i = 0; i < players.length && i < amountCourts * 4; i += 4) {
        const team1 = players.slice(i, i + 2);
        const team2 = players.slice(i + 2, i + 4);

        if (team1.length === 2 && team2.length === 2) {
            teams.push(createMatch(team1, team2));
        }
    }
    return teams;
}