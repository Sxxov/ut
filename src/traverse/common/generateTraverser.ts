/* eslint-disable @typescript-eslint/naming-convention */
export const TraverseBreak = Symbol('traverse break');
export const TraverseContinue = Symbol('traverse continue');

type TMixin<T> = T extends void
	? {
			BREAK(): never;
	  }
	: {
			BREAK(ret: T): never;
	  };

const mixin: TMixin<any> = {
	BREAK(v) {
		throw {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			[TraverseBreak]: v,
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
				if (TraverseBreak in (err as any)) return;

				throw err;
			}
		}) as unknown as T & TMixin<ReturnType<T>>,
		mixin,
	);
};
