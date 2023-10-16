import {
	generateTraverser,
	traverseContinue,
} from './common/generateTraverser.js';

export const traverseLeavesPair = generateTraverser(function impl<
	T extends Record<any, any>,
>(
	object1: T,
	object2: T,
	callback: (
		leaf1: any,
		leaf2: any,
		key: string | number | symbol,
		parent1: any,
		parent2: any,
	) => void,
) {
	for (const [key, value] of Object.entries(object1))
		if (typeof value === 'object' && value !== null)
			impl(value, object2[key], callback);
		else
			try {
				callback(value, object2[key], key, object1, object2);
			} catch (err) {
				if (traverseContinue in (err as any)) continue;
				throw err;
			}
});
