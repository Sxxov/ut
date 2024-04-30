import type { IterableKeys } from './IterableKeys.js';

export type IterableValues<T, Exclusion = {}> = {
	[K in IterableKeys<T, Exclusion>]-?: NonNullable<T[K]>;
}[IterableKeys<T, Exclusion>];
