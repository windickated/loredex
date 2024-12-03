import { writable } from 'svelte/store';
import { type Character } from '../lib/types';

type Modal = 'character' | 'timeline' | null;

export const showModal = writable<Modal>(null);
export const selectedCharacter = writable<Character | null>(null);
export const fullscreenPicture = writable<string | null>(null);