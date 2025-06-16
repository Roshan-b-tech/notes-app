import { writable } from 'svelte/store';
import type { Note } from '../types/Note';

export const notes = writable<Note[]>([]);
export const isLoading = writable<boolean>(false);
export const error = writable<string | null>(null);
export const searchQuery = writable<string>('');