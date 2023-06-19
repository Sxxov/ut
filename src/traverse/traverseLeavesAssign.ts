/*
	eslint-disable
		@typescript-eslint/no-unsafe-assignment
*/

import { IllegalInvocationError } from '../errors/IllegalInvocationError.js';
import { generateTraverser } from './common/generateTraverser.js';

export const traverseLeavesAssign = generateTraverser(function impl<
	T extends Record<any, any>,
>(
	from: T,
	to: Record<any, any> = {},
	instantiator = (
		fromClass: new (...args: any[]) => Record<any, any>,
		fromLeaf: Record<any, any>,
		toLeaf: any,
		key: string | number | symbol,
		fromParent: any,
		toParent: any,
	): any => {
		throw new IllegalInvocationError(
			`Attempted to assign class instance to mismatched object when traversing, without providing an instantiator`,
		);
	},
): T {
	for (const [key, value] of Object.entries(from))
		if (typeof value === 'object' && value !== null)
			impl(
				value,
				(typeof to[key] === 'object' && to[key] !== null
					? to[key]
					: value.constructor === Array
					? []
					: value.constructor === Object
					? {}
					: instantiator(
							value.constructor as new (...args: any[]) => Record<
								any,
								any
							>,
							value as Record<any, any>,
							to[key],
							key,
							from,
							to,
					  )) as Record<any, any>,
				instantiator,
			);
		else to[key] = value;

	return to;
});
