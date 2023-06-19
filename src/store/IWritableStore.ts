import type { IReadableStore } from './IReadableStore.js';

export * from './IReadableStore.js';

type TUpdater<T> = (v: T) => T;

export interface IWritableStore<T> extends IReadableStore<T> {
	set(value: T): void;
	update(updater: TUpdater<T>): void;
}
