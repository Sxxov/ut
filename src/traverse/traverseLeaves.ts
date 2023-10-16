import {
	generateTraverser,
	traverseContinue,
} from './common/generateTraverser.js';

export const traverseLeaves = generateTraverser(function impl(
	object: Record<any, any>,
	callback: (leaf: any, key: string | number | symbol, parent: any) => void,
) {
	for (const [key, value] of Object.entries(object)) {
		if (typeof value === 'object' && value !== null)
			impl(value as typeof object, callback);
		else
			try {
				callback(value, key, object);
			} catch (err) {
				if (traverseContinue in (err as any)) continue;
				throw err;
			}
	}
});
