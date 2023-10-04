import { clamp01 } from '../math/clamp01.js';
import { Store } from '../store/Store.js';
import { Supply } from '../store/Supply.js';
import { AnimatableIterationCount } from './AnimatableIterationCount.js';
import type { ReadableAnimatable } from './ReadableAnimatable.js';

export abstract class Animatable
	extends Supply<number>
	implements ReadableAnimatable
{
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

	public abstract readonly duration: number;
	public abstract readonly start: number;
	public abstract readonly end: number;
	public get range() {
		return this.end - this.start;
	}

	constructor() {
		super(new Store(0));
	}

	/**
	 * Play the animatable.
	 *
	 * @param direction The multiplier for the animatable's direction. If it's
	 *   0, the animatable will pause. If it's negative, the animatable will
	 *   play backwards. If it's positive, the animatable will play forwards.
	 *   Values greater than 1 will multiply the speed of the animatable.
	 */
	public async play(
		direction = 1,
		iterationCount:
			| AnimatableIterationCount
			| number = AnimatableIterationCount.ONCE,
	) {
		/**
		 * If the direction or iterationCount is 0, then it's equivalent to
		 * pausing (since we'd be moving nowhere).
		 */
		if (direction === 0 || iterationCount === 0) this.pause();
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
	 * Seek to a progress value.
	 *
	 * @param progress A value from 0 to 1, representing the completion of the
	 *   animatable.
	 */
	public abstract seekToProgress(progress: number): void;

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
	 * Seek to a value.
	 *
	 * @param value A value from the start to the end of the animatable,
	 *   representing the current value of the animatable.
	 */
	public seekToValue(value: number) {
		this.seekToProgress(value / this.range);
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
}
