import {
	TraverseShortCircuit,
	generateTraverser,
	traverseBreak,
	traverseContinue,
} from './common/generateTraverser.js';

export const traversePropertyElementsMap = generateTraverser(function impl<
	T extends Record<any, any>,
	Key extends {
		[K in keyof T]: T[K] extends any[] ? K : never;
	}[keyof T],
	R,
>(object: T, property: Key, callback: (object: T[Key][number]) => R, mapped: R[] = []) {
	if (typeof object[property] !== 'object' || object[property] === null)
		return mapped;

	for (const value of Object.values<T[Key][number]>(object[property])) {
		try {
			mapped.push(callback(value));
			impl(value, property, callback, mapped);
		} catch (err) {
			if (traverseContinue in (err as any))
				impl(value, property, callback, mapped);
			else if (traverseBreak in (err as any))
				TraverseShortCircuit.raise(mapped);
			else throw err;
		}
	}

	return mapped;
});
