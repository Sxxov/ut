import {
	generateTraverser,
	traverseContinue,
} from './common/generateTraverser.js';

export const traverseLeavesCompare = generateTraverser(function impl<
	T1 extends Record<string, any>,
	T2 extends Record<string, any>,
>(
	object1: T1,
	object2: T2,
	comparator = (
		leaf1: any,
		leaf2: any,
		key: string | number | symbol,
		parent1: any,
		parent2: any,
		// eslint-disable-next-line max-params
	) => leaf1 === leaf2,
) {
	for (const [key, value] of Object.entries(object1))
		if (
			typeof value === 'object' &&
			value !== null &&
			typeof object2[key] === 'object' &&
			object2[key] !== null
		) {
			if (!impl(value, object2[key], comparator)) return false;
		} else {
			let v: boolean;
			try {
				v = comparator(value, object2[key], key, object1, object2);
			} catch (err) {
				if (traverseContinue in (err as any)) continue;
				throw err;
			}

			if (!v) return false;
		}

	return true;
});
