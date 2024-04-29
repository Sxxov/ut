/*
	eslint-disable
		@typescript-eslint/no-unsafe-return,
		@typescript-eslint/no-unsafe-argument,
*/

import { Store } from './Store.js';
import { Supply } from './Supply.js';

export const deduce = <
	T extends (Store<any> | Supply<any>)[],
	Callback extends (
		...values: {
			[k in keyof T]: ReturnType<T[k]['get']>;
		}
	) => any,
>(
	stores: T,
	callback: Callback,
) => {
	if (stores.length === 0) return (callback as () => ReturnType<Callback>)();

	let values = stores.map((store) => store.get());

	const out = new Store<ReturnType<Callback>>(callback(...(values as any)));

	const subscriber = () => {
		const newValues = stores.map((store) => store.get());

		if (values.some((value, i) => value !== newValues[i]))
			out.set(callback(...(newValues as any)));

		values = newValues;
	};

	const unsubscribes = stores.map((store) => store.subscribeLazy(subscriber));
	const supply = new (class<T> extends Supply<T> {
		public override destroy() {
			for (const unsubscribe of unsubscribes) unsubscribe();

			super.destroy();
		}
	})(out);

	return supply as Supply<ReturnType<Callback>>;
};
