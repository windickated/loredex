import { writable } from 'svelte/store';
import { type Character } from '../lib/character';

type Modal = 'character' | 'timeline' | null;

export const showModal = writable<Modal>(null);
export const selectedCharacter = writable<Character | null>(null);
export const characterColor = writable<string>('rgba(150, 150, 150, 0.75)');