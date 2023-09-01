/* eslint-disable @typescript-eslint/ban-types */
import { ExtensibleStore } from './ExtensibleStore.js';

export type WeakSetStorify<T extends WeakSet<any>> = T extends WeakSet<infer U>
	? WeakSetStore<U>
	: never;

export interface WeakSetStore<T extends object = object>
	extends ExtensibleStore<WeakSet<T>>,
		Set<T> {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class WeakSetStore<T extends object = object> extends ExtensibleStore<
	WeakSet<T>
> {
	constructor(iterable?: Iterable<T>) {
		super(new Set(iterable));

		// eslint-disable-next-line no-constructor-return
		return this.proxy;
	}

	public add(value: T): this {
		const has = this.has(value);

		this.value.add(value);

		if (!has) this.trigger();

		return this;
	}

	public delete(value: T): boolean {
		const result = this.value.delete(value);

		if (result) {
			this.trigger();
		}

		return result;
	}
}
