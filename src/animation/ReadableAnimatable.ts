import type { Supply } from '../store/Supply.js';

export type ReadableAnimatable<T> = Supply<T> & {
	/** The duration of the animatable in milliseconds. */
	readonly duration: number;
	/** Whether the Animatable is in a playing state. */
	readonly playing: boolean;
};
