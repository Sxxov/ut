export const traverseBreak = Symbol('traverseBreak');
export const traverseContinue = Symbol('traverseContinue');

type Mixin<T> = (T extends void
	? {
			break(): never;
	  }
	: {
			break(ret: T): never;
	  }) & {
	continue(): never;
};

const mixin: Mixin<any> = {
	break(v) {
		throw {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			[traverseBreak]: v,
		};
	},
	continue() {
		throw {
			[traverseContinue]: true,
		};
	},
};

export const generateTraverser = <T extends (...args: any) => any>(impl: T) => {
	return Object.assign(
		((...args: any[]) => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
				return impl(...args);
			} catch (err) {
				if (traverseBreak in (err as any)) return;

				throw err;
			}
		}) as unknown as T & Mixin<ReturnType<T>>,
		mixin,
	);
};
