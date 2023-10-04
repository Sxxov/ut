import type { Supply } from '../store/Supply.js';

export interface ReadableAnimatable extends Supply<number> {
	/** The duration of the animatable in milliseconds. */
	readonly duration: number;
	/** The start value of the animatable. */
	readonly start: number;
	/** The end value of the animatable. */
	readonly end: number;
	/** The range of the animatable from start to end. */
	readonly range: number;
	/** Whether the Animatable is in a playing state. */
	readonly playing: boolean;
}
