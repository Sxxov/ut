import {
	generateTraverser,
	traverseContinue,
} from './common/generateTraverser.js';

export const traversePropertyMap = generateTraverser(function impl<
	T extends Record<any, any>,
	Key extends keyof T,
	R,
>(
	object: T,
	property: Key,
	callback: (object: T[Key][number]) => R,
	mapped: R[] = [],
) {
	if (typeof object[property] !== 'object' || object[property] === null)
		return mapped;

	for (const value of Object.values<T[Key][number]>(object[property])) {
		try {
			mapped.push(callback(value));
		} catch (err) {
			if (traverseContinue in (err as any)) continue;
			throw err;
		} finally {
			impl(value, property, callback, mapped);
		}
	}

	return mapped;
});
