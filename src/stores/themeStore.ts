import { writable } from 'svelte/store';

export type Theme = 'dark' | 'red' | 'blue' | 'green';
export const themes: Theme[] = ['dark', 'red', 'blue', 'green'];
export const theme = writable<Theme>('dark');

export function setTheme(newTheme: Theme) {
    theme.set(newTheme);
} 