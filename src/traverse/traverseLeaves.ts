import { generateTraverser } from './common/generateTraverser.js';

export const traverseLeaves = generateTraverser(function impl(
	object: Record<any, any>,
	callback: (leaf: any, key: string | number | symbol, parent: any) => void,
) {
	for (const [key, value] of Object.entries(object)) {
		if (typeof value === 'object' && value !== null)
			impl(value as typeof object, callback);
		else callback(value, key, object);
	}
});
