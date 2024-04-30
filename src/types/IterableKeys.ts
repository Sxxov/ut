export type IterableKeys<T, Exclusion = {}> = {
	[K in Exclude<keyof T, keyof Exclusion>]: T[K] extends
		| Iterable<any>
		| undefined
		? K
		: never;
}[Exclude<keyof T, keyof Exclusion>];
