import type { TIfEquals } from './TIfEquals.js';

export type TCoalesceNever<T, Else> = TIfEquals<T, never, Else, T>;
