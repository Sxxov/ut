import { clamp01 } from '../math/clamp01.js';
import { Animatable } from './Animatable.js';
import { AnimatableIterationCount } from './AnimatableIterationCount.js';
import { Timeline } from './Timeline.js';
import type { TimelineAt } from './TimelineAt.js';
import type { TimelineSegment } from './TimelineSegment.js';
import type { Tween } from './Tween.js';

export class Composition extends Animatable {
	private tweenToSegment = new WeakMap<Tween, TimelineSegment>();

	public get duration() {
		return this.timeline.computed.duration;
	}

	public get start() {
		return this.timeline.computed.start;
	}

	public get end() {
		return this.timeline.computed.end;
	}

	constructor(public readonly timeline: Timeline = new Timeline()) {
		super();
	}

	public add(tween: Tween, at: TimelineAt) {
		const segment: TimelineSegment = { tween, at };
		this.tweenToSegment.set(tween, segment);
		this.timeline.add(segment);

		return this;
	}

	public remove(tween: Tween) {
		const segment = this.tweenToSegment.get(tween);
		if (segment) this.timeline.remove(segment);

		return this;
	}

	public override async play(
		direction = 1,
		iterationCount:
			| AnimatableIterationCount
			| number = AnimatableIterationCount.ONCE,
	) {
		for (const segment of this.timeline.segments) segment.tween.pause();

		return super.play(direction, iterationCount);
	}

	public override seekToProgress(progress: number): void {
		for (const { tween, time } of this.timeline.computed.segments) {
			const startTime = time;
			const startProgress = startTime / this.duration;
			const endTime = time + tween.duration;
			const endProgress = endTime / this.duration;
			const tweenProgress = clamp01(
				(progress - startProgress) / (endProgress - startProgress),
			);

			tween.seekToProgress(tweenProgress);
		}

		this.store.set(progress * this.range);
		this.progress = progress;
	}

	public override destroy(): void {
		super.destroy();
		this.timeline.destroy();
	}
}
