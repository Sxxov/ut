import {
	generateTraverser,
	traverseContinue,
} from './common/generateTraverser.js';

export const traversePropertyElements = generateTraverser(function impl<
	T extends Record<any, any>,
	Key extends {
		[K in keyof T]: T[K] extends any[] ? K : never;
	}[keyof T],
>(object: T, property: Key, callback: (object: T[Key][number]) => void) {
	if (typeof object[property] !== 'object' || object[property] === null)
		return;

	for (const value of Object.values<T[Key][number]>(object[property])) {
		try {
			callback(value);
			impl(value, property, callback);
		} catch (err) {
			if (traverseContinue in (err as any))
				impl(value, property, callback);
			else throw err;
		}
	}
});
