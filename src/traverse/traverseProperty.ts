import {
	generateTraverser,
	traverseContinue,
} from './common/generateTraverser.js';

export const traverseProperty = generateTraverser(function impl<
	T extends Record<any, any>,
	Key extends keyof T,
>(object: T, property: Key, callback: (object: T[Key][number]) => void) {
	if (typeof object[property] !== 'object' || object[property] === null)
		return;

	for (const value of Object.values<T[Key][number]>(object[property])) {
		try {
			callback(value);
		} catch (err) {
			if (traverseContinue in (err as any)) continue;
			throw err;
		} finally {
			impl(value, property, callback);
		}
	}
});
