/*
	eslint-disable
		@typescript-eslint/no-unsafe-return,
		@typescript-eslint/no-unsafe-argument,
*/

import { type Store } from './Store.js';
import { type Supply } from './Supply.js';

export const use = <T extends readonly (Store<any> | Supply<any>)[]>(
	stores: T,
	callback: (values: {
		[k in keyof T]: ReturnType<T[k]['get']>;
	}) => void,
) => {
	const values = stores.map((store) => store.get());

	const subscriber = () => {
		const newValues = stores.map((store) => store.get());

		if (values.some((value, i) => value !== newValues[i]))
			callback(newValues as any);

		values.splice(0, values.length, ...newValues);
	};

	const unsubscribes = stores.map((store) => store.subscribeLazy(subscriber));

	subscriber();

	return () => {
		for (const unsubscribe of unsubscribes) unsubscribe();
	};
};
