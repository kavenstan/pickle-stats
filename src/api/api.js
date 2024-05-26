import { baseUrl } from '../utils/config';

export async function fetchRatings() {
    const ratingsRes = await fetch(`${baseUrl}/player_ratings.json`);
    return await ratingsRes.json();
}

export async function fetchPlayerStats() {
    const statsRes = await fetch(`${baseUrl}/player_stats.json`);
    return await statsRes.json();
}

export async function fetchMatches() {
    const matchesRes = await fetch(`${baseUrl}/match_results.json`);
    return await matchesRes.json();
}
