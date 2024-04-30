import { clamp01 } from '../math/clamp01.js';
import { Supply } from '../store/Supply.js';
import type { OrAnyNumber } from '../types/OrAnyNumber.js';
import { AnimatableIterationCount } from './AnimatableIterationCount.js';
import type { ReadableAnimatable } from './ReadableAnimatable.js';

export abstract class Animatable<T>
	extends Supply<T>
	implements ReadableAnimatable<T>
{
	public abstract readonly duration: number;

	/** The current progress of the animatable, from 0 to 1. */
	protected progress = 0;
	/** The return value of {@linkcode requestAnimationFrame} in {@linkcode play}. */
	protected rafHandle: number | undefined = undefined;
	/** A promise that resolves when the animatable is done playing. */
	protected resolve: (() => void) | undefined = undefined;

	#playing = false;
	public get playing() {
		return this.#playing;
	}

	/**
	 * Play the animatable.
	 *
	 * @param direction The multiplier for the animatable's direction.
	 *
	 *   - `0`: Equivalent to {@linkcode pause}.
	 *   - `1`: Play forwards.
	 *   - `-1`: Play backwards.
	 *   - Any other number: Play forwards or backwards, depending on the sign, with
	 *       the value multiplying the speed of the animation.
	 *
	 * @param iterationCount The number of times the animatable should play.
	 */
	public async play(
		direction: OrAnyNumber<1 | -1 | 0> = 1,
		iterationCount: OrAnyNumber<AnimatableIterationCount> = AnimatableIterationCount.ONCE,
	) {
		/**
		 * If the direction or iterationCount is 0, then it's equivalent to
		 * pausing (since we'd be moving nowhere).
		 */
		if (direction === 0 || iterationCount === 0) {
			this.pause();
			return;
		}

		/**
		 * If the animatable currently has a queued raf, cancel it since we're
		 * gonna be requesting a new one if necessary, & stop if not.
		 */
		if (this.rafHandle) cancelAnimationFrame(this.rafHandle);

		let iterationIndex = 0;
		const { progress: initialProgress } = this;
		let startTime: number | undefined;
		let endTime: number | undefined;

		/** Set the state as playing. */
		this.#playing = true;

		/**
		 * Create the promise that will be resolved when the animatable ends or
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
			if (!this.#playing) return;

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
			 * If the animatable is not done, request another frame. Otherwise,
			 * the animatable is over, so stop the animatable & resolve the
			 * promise.
			 */
			if (time < endTime) this.rafHandle = requestAnimationFrame(step);
			else {
				++iterationIndex;

				if (iterationIndex < iterationCount) {
					if (iterationCount === AnimatableIterationCount.ALTERNATE)
						direction *= -1;

					[startTime, endTime] = [undefined, undefined];
					this.seekToProgress(direction > 0 ? 1 : 0);

					this.rafHandle = requestAnimationFrame(step);
				} else {
					this.seekToProgress(direction > 0 ? 1 : 0);
					this.pause();
				}
			}
		};

		/** Initiate the first raf */
		this.rafHandle = requestAnimationFrame(step);

		/** Return the created, unresolved promise */
		await promise;
	}

	/** Pause the animatable. */
	public pause() {
		if (this.rafHandle) {
			cancelAnimationFrame(this.rafHandle);
			this.rafHandle = undefined;
		}

		this.#playing = false;
		this.resolve?.();
		this.resolve = undefined;
	}

	/** Stop the animatable, resetting the value to the start value. */
	public stop() {
		this.pause();
		this.seekToProgress(0);
	}

	/**
	 * Seek to a time.
	 *
	 * @param time A value from 0 to the duration of the animatable,
	 *   representing the current point in time of the animatable.
	 */
	public seekToTime(time: number) {
		this.seekToProgress(time / this.duration);
	}

	/**
	 * Destroy the animatable, stopping it & removing all subscribers to it.
	 *
	 * @remarks
	 *   The animatable should be considered garbage after this. Using it after
	 *   calling {@linkcode destroy} is undefined behaviour.
	 */
	public override destroy() {
		super.destroy();
		this.stop();
	}

	/**
	 * Seek to a progress value.
	 *
	 * @param progress A value from 0 to 1, representing the completion of the
	 *   animatable.
	 */
	public abstract seekToProgress(progress: number): void;
}
