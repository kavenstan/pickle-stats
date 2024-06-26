export function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return hash;
}

export function getAvatarColor(name) {
    const hash = hashString(name);
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
}

export function getInitials(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
}

export function formatName(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function isNewDate(index, matches) {
    if (index === 0) return true;
    return matches[index].date !== matches[index - 1].date;
}

export function getResultColor(score1, score2) {
    if (score1 > score2) return ['0, 128, 0', '128, 0, 0'];
    if (score1 < score2) return ['128, 0, 0', '0, 128, 0'];
    return ['128, 128, 0', '128, 128, 0'];
}

export function sortByRating(playerRatings) {
    return Object.entries(playerRatings)
        .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
        .map(([player, rating]) => ({ player, rating }));
}

const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124', '#45B8AC', '#EFC050', '#5B5EA6', '#9B2335', '#DFCFBE', '#BC243C', '#C3447A', '#98B4D4', '#A593E0', '#F0E68C', '#D2691E', '#BDB76B', '#8B0000', '#556B2F', '#FF8C00', '#9932CC', '#8FBC8F', '#483D8B', '#2F4F4F', '#FFD700', '#7CFC00'];