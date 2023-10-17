/*
	eslint-disable
		@typescript-eslint/no-unsafe-return
*/

import {
	TraverseShortCircuit,
	generateTraverser,
	traverseBreak,
	traverseContinue,
} from './common/generateTraverser.js';

export const traverseLeavesMap = generateTraverser(function impl(
	object: Record<any, any>,
	callback: (leaf: any, key: string | number | symbol, parent: any) => any,
	mapped: any[] = [],
) {
	for (const [key, value] of Object.entries(object))
		if (typeof value === 'object' && value !== null)
			impl(value as typeof object, callback, mapped);
		else
			try {
				mapped.push(callback(value, key, object));
			} catch (err) {
				if (traverseContinue in (err as any)) continue;
				if (traverseBreak in (err as any))
					TraverseShortCircuit.raise(mapped);
				throw err;
			}

	return mapped;
});
