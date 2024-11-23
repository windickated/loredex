import { writable } from 'svelte/store';
import { type Character } from '../lib/character';

export const showModal = writable<boolean>(false);
export const selectedCharacter = writable<Character | null>(null);
export const characterColor = writable<string>('rgba(150, 150, 150, 0.75)');