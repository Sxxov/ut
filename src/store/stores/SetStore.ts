import { ExtensibleStore } from './ExtensibleStore.js';

export type TSetStorify<T extends Set<any>> = T extends Set<infer U>
	? SetStore<U>
	: never;

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface SetStore<T = unknown>
	extends ExtensibleStore<Set<T>>,
		Set<T> {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class SetStore<T = unknown> extends ExtensibleStore<Set<T>> {
	private setLength = 0;

	constructor(iterable?: Iterable<T>) {
		super(new Set(iterable));

		// eslint-disable-next-line no-constructor-return
		return this.proxy;
	}

	public [Symbol.iterator](): IterableIterator<T> {
		return this.value.values();
	}

	public add(value: T): this {
		this.value.add(value);

		if (this.value.size !== this.setLength) {
			this.trigger();
		}

		return this;
	}

	public delete(value: T): boolean {
		const result = this.value.delete(value);

		if (result) {
			this.trigger();
		}

		return result;
	}

	public clear(): void {
		this.value.clear();

		this.trigger();
	}

	// public has = this.value.has;
	// public entries = this.value.entries;
	// public forEach = this.value.forEach
	// public keys = this.value.keys;
	// public values = this.value.values;
	// public size = this.value.size;
	// [Symbol.iterator] = this.value[Symbol.iterator];
	// [Symbol.toStringTag] = this.value[Symbol.toStringTag];
}
