/*
	eslint-disable
		@typescript-eslint/no-unsafe-assignment
*/

import { generateTraverser } from './common/generateTraverser.js';

export const traverseLeavesMap = generateTraverser(function impl(
	object: Record<any, any>,
	callback: (leaf: any, key: string | number | symbol, parent: any) => any,
) {
	const result: Record<string, any> = {};

	for (const [key, value] of Object.entries(object))
		result[key] =
			typeof value === 'object' && value !== null
				? impl(value as typeof object, callback)
				: callback(value, key, object);

	return result;
});
