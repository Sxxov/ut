import { ShapedArrayStore } from './ShapedArrayStore.js';

export type TArrayStorify<T extends any[]> = T extends (infer U)[]
	? ArrayStore<U>
	: never;

export class ArrayStore<Element = unknown> extends ShapedArrayStore<Element[]> {
	constructor(length = 0) {
		super(new Array<Element>(length));
	}
}
