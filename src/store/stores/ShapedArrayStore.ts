/* 
	eslint-disable
		@typescript-eslint/no-unsafe-assignment,
		@typescript-eslint/no-unsafe-return,
*/

import type { ArrayElement } from '../../types/ArrayElement.js';
import { ExtensibleStore } from './ExtensibleStore.js';

export type ShapedArrayStorify<T extends any[]> = ShapedArrayStore<T>;

// @ts-expect-error shape will refer to the value, which is safe

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ShapedArrayStore<Shape extends any[] = unknown[]>
	extends ExtensibleStore<Shape>,
		Shape {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ShapedArrayStore<
	Shape extends any[],
> extends ExtensibleStore<Shape> {
	constructor(array: Shape) {
		super(array);

		// eslint-disable-next-line no-constructor-return
		return this.proxy;
	}

	public [Symbol.iterator](): IterableIterator<ArrayElement<Shape>> {
		return this.value.values();
	}

	public get length(): Shape['length'] {
		return this.value.length;
	}

	public removeAt(index: number): void {
		this.value.splice(index, 1);

		this.trigger();
	}

	public remove(...items: ArrayElement<Shape>[]): void {
		items.forEach((item) => {
			this.value.splice(this.value.indexOf(item), 1);
		});

		this.trigger();
	}

	public setAt<Index extends number>(
		index: Index,
		newValue: Shape[Index],
	): void {
		this.value[index] = newValue;

		this.trigger();
	}

	public getAt<Index extends number>(index: Index): Shape[Index] {
		return this.value[index];
	}

	public push(...items: ArrayElement<Shape>[]): number {
		const result = this.value.push(...items);

		this.trigger();

		return result;
	}

	public pop(): ArrayElement<Shape> | undefined {
		const result = this.value.pop();

		this.trigger();

		return result;
	}

	public shift(): ArrayElement<Shape> | undefined {
		const result = this.value.shift();

		this.trigger();

		return result;
	}

	public unshift(...items: ArrayElement<Shape>[]): number {
		const result = this.value.unshift(...items);

		this.trigger();

		return result;
	}

	public splice(
		start: number,
		deleteCount = 0,
		...items: ArrayElement<Shape>[]
	): ArrayElement<Shape>[] {
		const result = this.value.splice(start, deleteCount, ...items);

		this.trigger();

		return result;
	}

	public reverse(): ArrayElement<Shape>[] {
		const result = this.value.reverse();

		this.trigger();

		return result;
	}

	public sort(
		compareFn?: (a: ArrayElement<Shape>, b: ArrayElement<Shape>) => number,
	): this {
		this.value.sort(compareFn);

		this.trigger();

		return this;
	}
}
