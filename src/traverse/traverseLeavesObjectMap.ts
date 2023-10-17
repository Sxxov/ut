/*
	eslint-disable
		@typescript-eslint/no-unsafe-assignment
*/

import {
	TraverseShortCircuit,
	generateTraverser,
	traverseBreak,
	traverseContinue,
} from './common/generateTraverser.js';

export const traverseLeavesObjectMap = generateTraverser(function impl(
	object: Record<any, any>,
	callback: (leaf: any, key: string | number | symbol, parent: any) => any,
) {
	const result: Record<string, any> = {};

	for (const [key, value] of Object.entries(object))
		if (typeof value === 'object' && value !== null)
			result[key] = impl(value as typeof object, callback);
		else
			try {
				result[key] = callback(value, key, object);
			} catch (err) {
				if (traverseContinue in (err as any)) continue;
				if (traverseBreak in (err as any))
					TraverseShortCircuit.raise(result);
				throw err;
			}

	return result;
});
