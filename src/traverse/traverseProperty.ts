import {
	generateTraverser,
	traverseContinue,
} from './common/generateTraverser.js';

export const traverseProperty = generateTraverser(function impl<
	T extends Record<any, any>,
	Key extends keyof T,
>(object: T, property: Key, callback: (object: T[Key]) => void) {
	const value = object[property];

	if (typeof value !== 'object' || value === null) return;

	try {
		callback(value);
		impl(value, property, callback);
	} catch (err) {
		if (traverseContinue in (err as any)) impl(value, property, callback);
		else throw err;
	}
});
