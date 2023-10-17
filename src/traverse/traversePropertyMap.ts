import {
	TraverseShortCircuit,
	generateTraverser,
	traverseBreak,
	traverseContinue,
} from './common/generateTraverser.js';

export const traversePropertyMap = generateTraverser(function impl<
	T extends Record<any, any>,
	Key extends keyof T,
	R,
>(object: T, property: Key, callback: (object: T[Key]) => R, mapped: R[] = []) {
	const value = object[property];

	if (typeof value !== 'object' || value === null) return mapped;

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

	return mapped;
});
