/* eslint-disable @typescript-eslint/no-throw-literal */
/** @internal */
export const traverseBreak = Symbol('traverseBreak');
/** @internal */
export const traverseContinue = Symbol('traverseContinue');
/** @internal */
export const traverseRaise = Symbol('traverseRaise');
/** @internal */
export const traverseShortCircuit = Symbol('traverseShortCircuit');

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TraverseShortCircuit {
	public static break(): never {
		throw {
			[traverseBreak]: true,
			[traverseShortCircuit]: true,
		};
	}

	public static continue(): never {
		throw {
			[traverseContinue]: true,
			[traverseShortCircuit]: true,
		};
	}

	/** @internal */
	public static raise(payload: unknown): never {
		throw {
			[traverseRaise]: payload,
			[traverseShortCircuit]: true,
		};
	}
}

export const generateTraverser = <T extends (...args: any) => any>(impl: T) => {
	return Object.assign(
		((...args: any[]) => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
				return impl(...args);
			} catch (err) {
				if (traverseBreak in (err as any)) return;
				if (traverseRaise in (err as any))
					return (err as any)[traverseRaise] as ReturnType<T>;

				throw err;
			}
		}) as unknown as T,
		{
			break: TraverseShortCircuit.break,
			continue: TraverseShortCircuit.continue,
		},
	);
};
