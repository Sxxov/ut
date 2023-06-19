import { bezierLinear } from '../bezier/beziers/bezierLinear.js';
import { clamp01 } from '../math/clamp01.js';
import { map } from '../math/map.js';
import { Store } from '../store/Store.js';
import { Supply } from '../store/Supply.js';
import type { IAnimatable } from './IAnimatable.js';

export class Tween extends Supply<number> implements IAnimatable {
	private progress = 0;
	private rafHandle: number | undefined = undefined;
	private resolve: (() => void) | undefined = undefined;

	#isPlaying = new Store(false);
	public readonly isPlaying = this.#isPlaying.supply;

	public readonly length: number;

	constructor(
		public readonly start: number,
		public readonly end: number,
		public readonly duration: number,
		public readonly bezier = bezierLinear,
	) {
		super(new Store(start));

		this.length = Math.abs(end - start);
	}

	public async play(direction = 1) {
		if (this.rafHandle) cancelAnimationFrame(this.rafHandle);
		if (direction === 0) return;

		const { progress: initialProgress } = this;
		let startTime: number;
		let endTime: number;

		this.#isPlaying.set(true);

		const promise = new Promise<void>((resolve) => {
			this.resolve = resolve;
		});

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

	public pause() {
		if (this.rafHandle) {
			cancelAnimationFrame(this.rafHandle);
			this.rafHandle = undefined;
		}

		this.#isPlaying.set(false);
		this.resolve?.();
		this.resolve = undefined;
	}

	public stop() {
		this.pause();

		this.store.set(this.start);
	}

	public seekToProgress(progress: number) {
		this.store.set(
			map(this.bezier.at(progress), 0, 1, this.start, this.end),
		);
		this.progress = progress;
	}

	public seekToTime(time: number) {
		this.seekToProgress(time / this.duration);
	}

	public seekToValue(value: number) {
		this.seekToProgress(map(value, this.start, this.end, 0, 1));
	}

	public override destroy() {
		this.stop();
		super.destroy();
	}
}
