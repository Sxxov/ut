import { clamp01 } from '../math/clamp01.js';
import { Store } from '../store/Store.js';
import { Animatable } from './Animatable.js';
import { AnimatableIterationCount } from './AnimatableIterationCount.js';
import type { CompositionFrame } from './CompositionFrame.js';
import { Timeline } from './Timeline.js';
import type { TimelineAt } from './TimelineAt.js';
import type { TrackKeyframeValue } from './TrackKeyframeValue.js';

export class Composition<
	V = number | TrackKeyframeValue | CompositionFrame,
> extends Animatable<CompositionFrame> {
	public get duration() {
		return this.timeline.computed.duration;
	}

	constructor(public readonly timeline: Timeline<V> = new Timeline()) {
		super(new Store<CompositionFrame>([]));

		timeline.subscribeLazy(() => {
			this.seekToProgress(this.progress);
		});
	}

	public add(x: Animatable<V>, at?: TimelineAt) {
		this.timeline.add({ x, at });

		return this;
	}

	public has(x: Animatable<V>) {
		return this.timeline.segments.some((segment) => segment.x === x);
	}

	public remove(x: Animatable<V>) {
		const segment = this.timeline.segments.find(
			(segment) => segment.x === x,
		);
		if (segment) this.timeline.remove(segment);

		return this;
	}

	public override async play(
		direction = 1,
		iterationCount:
			| AnimatableIterationCount
			| number = AnimatableIterationCount.ONCE,
	) {
		for (const segment of this.timeline.segments) segment.x.pause();

		return super.play(direction, iterationCount);
	}

	public override seekToProgress(progress: number): void {
		const frame = this.get();

		for (let i = 0; i < this.timeline.segments.length; ++i) {
			const { x, time } = this.timeline.computed.segments[i]!;

			const startTime = time;
			const startProgress = startTime / this.duration;
			const endTime = time + x.duration;
			const endProgress = endTime / this.duration;
			const tweenProgress = clamp01(
				(progress - startProgress) / (endProgress - startProgress),
			);

			x.seekToProgress(tweenProgress);

			const frameSegment = frame[i];
			if (frameSegment && frameSegment.x === x)
				frameSegment.value = tweenProgress;
			else
				frame[i] = {
					// not sure what the issue is here
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					composition: this as any,
					x,
					value: tweenProgress,
				};
		}

		this.progress = progress;

		frame.length = this.timeline.segments.length;
		this.trigger();
	}

	public override destroy(): void {
		super.destroy();
		this.timeline.destroy();
	}
}
