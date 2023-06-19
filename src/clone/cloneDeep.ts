/*
	eslint-disable
		@typescript-eslint/no-unsafe-assignment,
		@typescript-eslint/no-unsafe-return,
		@typescript-eslint/no-unsafe-call
*/

// yanked from https://stackoverflow.com/a/40294058
export const cloneDeep = <T extends Record<any, any>>(
	object: T,
	hash = new WeakMap(),
): T => {
	// primitives
	if (Object(object) !== object) return object;

	// cyclic reference
	if (hash.has(object)) return hash.get(object);

	const result: T =
		object instanceof Set
			? new Set(object) // See note about this!
			: object instanceof Map
			? new Map(
					Array.from(object, ([key, val]) => [
						key,
						cloneDeep(val, hash),
					]),
			  )
			: object instanceof Date
			? new Date(object)
			: object instanceof RegExp
			? new RegExp(object.source, object.flags)
			: // ... add here any specific treatment for other classes ...
			// and finally a catch-all:
			object.constructor
			? new (object as any).constructor()
			: Object.create(null);
	hash.set(object, result);

	return Object.assign(
		result,
		...Object.keys(object).map((key) => ({
			[key]: cloneDeep(object[key], hash),
		})),
	);
};
