import type { IfEquals } from './IfEquals.js';

export type CoalesceNever<T, Else> = IfEquals<T, never, Else, T>;
