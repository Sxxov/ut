import { bezierLinear } from '../bezier/beziers/bezierLinear.js';
import { IllegalStateError } from '../errors/IllegalStateError.js';
import { UnimplementedError } from '../errors/UnimplementedError.js';
import { UnreachableError } from '../errors/UnreachableError.js';
import type { TrackComputedKeyframe } from './TrackComputedKeyframe.js';
import type { TrackComputedKeyframeCollecton } from './TrackComputedKeyframeCollection.js';
import type { TrackKeyframe } from './TrackKeyframe.js';
import type { TrackKeyframeValue } from './TrackKeyframeValue.js';

export class TrackComputedKeyframeCollectionFactory<
	V extends TrackKeyframeValue,
> {
	private computed = false;
	private computedKeyframes: TrackComputedKeyframe<V>[] = [];
	private computedDuration = 0;
	private prev = 0;
	private cum = 0;

	constructor(private readonly keyframes: readonly TrackKeyframe<V>[]) {}

	public create(): Readonly<TrackComputedKeyframeCollecton<V>> {
		if (!this.computed) {
			this.computeKeyframes(0, this.keyframes.length - 1);
			this.computedDuration = this.computedKeyframes.reduce(
				(duration, { time }) => Math.max(duration, time),
				0,
			);
			this.computed = true;
		}

		return {
			keyframes: this
				.computedKeyframes as readonly TrackComputedKeyframe<V>[],
			duration: this.computedDuration,
		} as const;
	}

	private computeKeyframes(rangeStart: number, rangeEnd: number) {
		for (let i = rangeStart; i <= rangeEnd; ++i) {
			if (this.computedKeyframes[i]) continue;

			const { x, at, label, bezier } = this.keyframes[i]!;
			let time: number;

			if (!at) {
				time = this.prev;
			} else if ('time' in at) {
				time = at.time;
			} else if ('start' in at) {
				time = at.start;
			} else if ('end' in at) {
				time = this.cum + at.end;
			} else if ('label' in at) {
				const index = this.keyframes.findIndex(
					(segment) => segment.label === at.label,
				);

				if (index < 0)
					throw new IllegalStateError(
						`Keyframe label "${at.label}" does not exist.`,
					);

				if (index === i)
					throw new IllegalStateError(
						`Keyframe label "${at.label}" cannot reference itself.`,
					);

				if (index < i) {
					const labelled = this.computedKeyframes[index]!;

					time = labelled.time + (at.offset ?? 0);
				} else if (index > i) {
					this.computeKeyframes(i + 1, index);

					time =
						this.computedKeyframes[index]!.time + (at.offset ?? 0);
				} else throw new UnreachableError();
			} else if ('offset' in at) {
				time = this.prev + at.offset;
			} else throw new UnimplementedError();

			this.computedKeyframes[i] = {
				label,
				x,
				time,
				bezier: bezier ?? bezierLinear,
			};

			this.prev = time;
			this.cum = Math.max(this.cum, this.prev);
		}
	}
}
