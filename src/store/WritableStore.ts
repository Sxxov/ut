import type { ReadableStore } from './ReadableStore.js';

export * from './ReadableStore.js';

export type Updater<T> = (v: T) => T;

export interface WritableStore<T> extends ReadableStore<T> {
	set(value: T): void;
	update(updater: Updater<T>): void;
}
