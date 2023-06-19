import type { TArrayElement } from './TArrayElement.js';

export type TArrayFlat<T extends any[]> = TArrayElement<T>[];
