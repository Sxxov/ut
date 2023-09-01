import type { IterableKeys } from './IterableKeys.js';

// eslint-disable-next-line @typescript-eslint/ban-types
export type IterableValues<T, Exclusion = {}> = {
	[K in IterableKeys<T, Exclusion>]-?: NonNullable<T[K]>;
}[IterableKeys<T, Exclusion>];
