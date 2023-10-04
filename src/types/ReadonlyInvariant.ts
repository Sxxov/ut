export type ReadonlyInvariant<
	T,
	ReadonlyT extends Readonly<T> = Readonly<T>,
> = ReadonlyT & Partial<Record<Exclude<keyof T, keyof ReadonlyT>, never>>;
