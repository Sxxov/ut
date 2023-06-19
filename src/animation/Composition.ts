import { clamp01 } from '../math/clamp01.js';
import type { IAnimatable } from './IAnimatable.js';
import type { Tween } from './Tween.js';

export class Composition implements IAnimatable {
	private progress = 0;
	private rafHandle: number | undefined = undefined;
	private resolve: (() => void) | undefined = undefined;

	#isPlaying = false;
	public get isPlaying() {
		return this.#isPlaying;
	}

	public get duration() {
		return this.timeline.reduce(
			(duration, { tween, delay = 0 }) =>
				Math.max(duration, delay + tween.duration),
			0,
		);
	}

	public get length() {
		return this.timeline.reduce(
			(length, { tween, delay = 0 }) =>
				Math.max(length, delay + tween.length),
			0,
		);
	}

	constructor(
		public readonly timeline: { tween: Tween; delay?: number }[] = [],
	) {}

	public add(tween: Tween, delay = 0) {
		this.timeline.push({ tween, delay });
	}

	public addIdentity(tween: Tween, delay = 0) {
		this.add(tween, delay);

		return tween;
	}

	public delete(tween: Tween) {
		this.timeline.splice(
			this.timeline.findIndex((layer) => layer.tween === tween),
			1,
		);
	}

	public async play(direction = 1) {
		if (this.rafHandle) cancelAnimationFrame(this.rafHandle);
		if (direction === 0) return;

		const { progress: initialProgress } = this;
		let startTime: number;
		let endTime: number;

		this.#isPlaying = true;

		const promise = new Promise<void>((resolve) => {
			this.resolve = resolve;
		});

		for (const layer of this.timeline) layer.tween.pause();

		const step = (time: DOMHighResTimeStamp) => {
			if (!this.#isPlaying) return;

			startTime ??= time;
			endTime ??=
				startTime +
				this.duration *
					(direction > 0 ? 1 - initialProgress : initialProgress);

			this.seekToProgress(
				clamp01(
					initialProgress +
						((time - startTime) / this.duration) * direction,
				),
			);

			if (time < endTime) this.rafHandle = requestAnimationFrame(step);
			else {
				this.seekToProgress(direction > 0 ? 1 : 0);
				this.pause();
			}
		};

		this.rafHandle = requestAnimationFrame(step);

		await promise;
	}

	public pause(): void {
		if (this.rafHandle) {
			cancelAnimationFrame(this.rafHandle);
			this.rafHandle = undefined;
		}

		this.#isPlaying = false;
		this.resolve?.();
		this.resolve = undefined;
	}

	public stop(): void {
		this.pause();

		for (const layer of this.timeline) layer.tween.seekToProgress(0);
	}

	public seekToProgress(progress: number): void {
		for (const { tween, delay = 0 } of this.timeline) {
			const startTime = delay;
			const startProgress = startTime / this.duration;
			const endTime = delay + tween.duration;
			const endProgress = endTime / this.duration;
			const tweenProgress = clamp01(
				(progress - startProgress) / (endProgress - startProgress),
			);

			tween.seekToProgress(tweenProgress);
		}

		this.progress = progress;
	}

	public seekToTime(time: number): void {
		this.seekToProgress(time / this.duration);
	}

	public seekToValue(value: number): void {
		this.seekToProgress(value / this.length);
	}

	public destroy(): void {
		for (const layer of this.timeline) layer.tween.destroy();
		this.timeline.length = 0;
	}
}
