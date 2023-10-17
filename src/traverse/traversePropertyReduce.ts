import {
	TraverseShortCircuit,
	generateTraverser,
	traverseBreak,
	traverseContinue,
} from './common/generateTraverser.js';

export const traversePropertyReduce = generateTraverser(function impl<
	T extends Record<any, any>,
	Key extends {
		[K in keyof T]: T[K] extends any[] ? K : never;
	}[keyof T],
	R = T[Key][number] | undefined,
>(object: T, property: Key, callback: (prev: R, curr: T[Key][number]) => R, prev?: R) {
	const value = object[property];

	if (typeof value !== 'object' || value === null) return prev;

	try {
		prev = callback(prev!, value);
		impl(value, property, callback, prev);
	} catch (err) {
		if (traverseContinue in (err as any))
			impl(value, property, callback, prev);
		else if (traverseBreak in (err as any))
			TraverseShortCircuit.raise(prev);
		else throw err;
	}

	return prev;
});
