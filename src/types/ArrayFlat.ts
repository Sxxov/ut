import type { ArrayElement } from './ArrayElement.js';

export type ArrayFlat<T extends any[]> = ArrayElement<T>[];
