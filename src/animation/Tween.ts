import { bezierLinear } from '../bezier/beziers/bezierLinear.js';
import { clamp01 } from '../math/clamp01.js';
import { map } from '../math/map.js';
import { Store } from '../store/Store.js';
import { Supply } from '../store/Supply.js';
import type { IAnimatable } from './IAnimatable.js';

// jsdoc
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
export class Tween extends Supply<number> implements IAnimatable {
	/** The current progress of the tween, from 0 to 1. */
	private progress = 0;
	/** The return value of {@linkcode requestAnimationFrame} in {@linkcode play}. */
	private rafHandle: number | undefined = undefined;
	/** A promise that resolves when the tween is done playing. */
	private resolve: (() => void) | undefined = undefined;

	#isPlaying = false;
	/** Whether the Tween is in a playing state. */
	public get isPlaying() {
		return this.#isPlaying;
	}

	/** The length of the tween in milliseconds. */
	public get length() {
		return this.end - this.start;
	}

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

	/**
	 * Play the tween.
	 *
	 * @param direction The multiplier for the tween's direction. If it's 0, the
	 *   tween will pause. If it's negative, the tween will play backwards. If
	 *   it's positive, the tween will play forwards. Values greater than 1 will
	 *   multiply the speed of the tween.
	 */
	public async play(direction = 1) {
		/**
		 * If the direction is 0, then it's equivalent to pausing (since we'd be
		 * moving nowhere).
		 */
		if (direction === 0) this.pause();
		/**
		 * If the tween currently has a queued raf, cancel it since we're gonna
		 * be requesting a new one if necessary, & stop if not.
		 */
		if (this.rafHandle) cancelAnimationFrame(this.rafHandle);

		const { progress: initialProgress } = this;
		let startTime: number;
		let endTime: number;

		/** Set the state as playing. */
		this.#isPlaying = true;

		/**
		 * Create the promise that will be resolved when the tween ends or
		 * {@linkcode pause} is called.
		 */
		const promise = new Promise<void>((resolve) => {
			this.resolve = resolve;
		});

		/** The raf callback */
		const step = (time: DOMHighResTimeStamp) => {
			/**
			 * If it's not playing but we somehow forgot to cancel the raf
			 * handle, stop.
			 */
			if (!this.#isPlaying) return;

			/** Set the start & end time on the first step/invocation */
			startTime ??= time;
			endTime ??=
				startTime +
				this.duration *
					(direction > 0 ? 1 - initialProgress : initialProgress);

			/**
			 * Move the value according to the time passed since the last frame.
			 * This way we defend against lag & high refresh rate displays
			 */
			this.seekToProgress(
				clamp01(
					initialProgress +
						((time - startTime) / this.duration) * direction,
				),
			);

			/**
			 * If the tween is not done, request another frame. Otherwise, the
			 * tween is over, so stop the tween & resolve the promise.
			 */
			if (time < endTime) this.rafHandle = requestAnimationFrame(step);
			else {
				this.seekToProgress(direction > 0 ? 1 : 0);
				this.pause();
			}
		};

		/** Initiate the first raf */
		this.rafHandle = requestAnimationFrame(step);

		/** Return the created, unresolved promise */
		await promise;
	}

	/** Pause the tween. */
	public pause() {
		if (this.rafHandle) {
			cancelAnimationFrame(this.rafHandle);
			this.rafHandle = undefined;
		}

		this.#isPlaying = false;
		this.resolve?.();
		this.resolve = undefined;
	}

	/** Stop the tween, resetting the value to the start value. */
	public stop() {
		this.pause();

		this.store.set(this.start);
	}

	/**
	 * Seek to a progress value.
	 *
	 * @param progress A value from 0 to 1, representing the completion of the
	 *   tween.
	 */
	public seekToProgress(progress: number) {
		this.store.set(
			map(this.bezier.at(progress), 0, 1, this.start, this.end),
		);
		this.progress = progress;
	}

	/**
	 * Seek to a time.
	 *
	 * @param time A value from 0 to the duration of the tween, representing the
	 *   current point in time of the tween.
	 */
	public seekToTime(time: number) {
		this.seekToProgress(time / this.duration);
	}

	/**
	 * Seek to a value.
	 *
	 * @param value A value from the start to the end of the tween, representing
	 *   the current value of the tween.
	 */
	public seekToValue(value: number) {
		this.seekToProgress(map(value, this.start, this.end, 0, 1));
	}

	/**
	 * Destroy the tween, stopping it & removing all subscribers to it.
	 *
	 * @remarks
	 *   The tween should be considered garbage after this. Using it after calling
	 *   {@linkcode destroy} is undefined behaviour.
	 */
	public override destroy() {
		this.stop();
		super.destroy();
	}
}
