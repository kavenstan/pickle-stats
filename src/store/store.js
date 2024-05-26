import { writable } from 'svelte/store';

export const selectedPlayers = writable(new Set());