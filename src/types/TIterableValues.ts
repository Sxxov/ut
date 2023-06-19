import type { TIterableKeys } from './TIterableKeys.js';

// eslint-disable-next-line @typescript-eslint/ban-types
export type TIterableValues<T, Exclusion = {}> = {
	[K in TIterableKeys<T, Exclusion>]-?: NonNullable<T[K]>;
}[TIterableKeys<T, Exclusion>];
