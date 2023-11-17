import { bezierLinear } from '../bezier/beziers/bezierLinear.js';
import { IllegalAssignmentError } from '../errors/IllegalAssignmentError.js';
import { map } from '../math/map.js';
import { Store } from '../store/Store.js';
import { Supply } from '../store/Supply.js';
import { Animatable } from './Animatable.js';
import type { Composition } from './Composition.js';

/**
 * Tween is a {@linkcode Supply} that can be used to animate a value from one to
 * another.
 *
 * It's useful for anything that needs to be animated, like a progress bar, a
 * slider, etc.
 *
 * @see {@linkcode Composition} - If you want to compose multiple tweens into
 * one seekable & playable Supply.
 */
export class Tween extends Animatable<number> {
	public range = this.end - this.start;

	constructor(
		/**
		 * The start of the tween value—what the value will be when the tween
		 * starts.
		 */
		public readonly start: number,
		/**
		 * The end of the tween value—what the value will be when the tween
		 * stops.
		 */
		public readonly end: number,
		/** The duration of the tween in milliseconds. */
		public readonly duration: number,
		/**
		 * A bezier that controls the interpolation of the tween—changing the
		 * intermediate values.
		 */
		public readonly bezier = bezierLinear,
	) {
		super(new Store(start));
	}

	public override seekToProgress(progress: number) {
		this.store.set(
			map(this.bezier.at(progress), 0, 1, this.start, this.end),
		);
		this.progress = progress;
	}

	public seekToValue(value: number): void {
		this.store.set(value);
		this.progress = map(value, this.start, this.end, 0, 1);
	}
}
