import type { Supply } from '../store/Supply.js';

export interface ReadableAnimatable<T> extends Supply<T> {
	/** The duration of the animatable in milliseconds. */
	readonly duration: number;
	/** Whether the Animatable is in a playing state. */
	readonly playing: boolean;
}
