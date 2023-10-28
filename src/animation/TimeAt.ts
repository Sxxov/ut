import type { TimeAtEnd } from './TimeAtEnd.js';
import type { TimeAtLabel } from './TimeAtLabel.js';
import type { TimeAtOffset } from './TimeAtOffset.js';
import type { TimeAtStart } from './TimeAtStart.js';
import type { TimeAtTime } from './TimeAtTime.js';

// https://stackoverflow.com/a/46370791/9664601
type AllKeys<T> = T extends unknown ? keyof T : never;
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
type ExclusifyUnionImpl<T, K extends PropertyKey> = T extends unknown
	? Id<T & Partial<Record<Exclude<K, keyof T>, never>>>
	: never;
type ExclusifyUnion<T> = ExclusifyUnionImpl<T, AllKeys<T>>;

export type TimeAt =
	| ExclusifyUnion<
			TimeAtOffset | TimeAtTime | TimeAtLabel | TimeAtStart | TimeAtEnd
	  >
	| undefined;
