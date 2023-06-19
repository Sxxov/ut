import { bezierLinear } from '../bezier/beziers/bezierLinear.js';
import { clamp01 } from '../math/clamp01.js';
import { map } from '../math/map.js';
import { Store } from '../store/Store.js';
import { Supply } from '../store/Supply.js';
import type { IAnimatable } from './IAnimatable.js';

export class Tween extends Supply<number> implements IAnimatable {
	private progress = 0;
	private rafHandle: number | undefined = undefined;

	#isPlaying = false;
	public get isPlaying() {
		return this.#isPlaying;
	}

	public get length() {
		return this.end - this.start;
	}

	constructor(
		public readonly start: number,
		public readonly end: number,
		public readonly duration: number,
		public readonly bezier = bezierLinear,
	) {
		super(new Store(start));
	}

	public play(direction = 1) {
		if (this.rafHandle) cancelAnimationFrame(this.rafHandle);
		if (direction === 0) return;

		const { progress: initialProgress } = this;
		let startTime: number;
		let endTime: number;

		this.#isPlaying = true;

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
				this.pause();
				this.seekToProgress(direction > 0 ? 1 : 0);
			}
		};

		this.rafHandle = requestAnimationFrame(step);
	}

	public pause() {
		if (this.rafHandle) {
			cancelAnimationFrame(this.rafHandle);
			this.rafHandle = undefined;
		}

		this.#isPlaying = false;
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
