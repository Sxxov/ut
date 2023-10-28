import { IllegalStateError } from '../errors/IllegalStateError.js';
import { UnimplementedError } from '../errors/UnimplementedError.js';
import { UnreachableError } from '../errors/UnreachableError.js';
import { type TimelineComputedSegmentCollection } from './TimelineComputedSegmentCollection.js';
import type { TimelineComputedSegment } from './TimelineComputedSegment.js';
import type { TimelineSegment } from './TimelineSegment.js';

export class TimelineComputedSegmentCollectionFactory<V> {
	private computed = false;
	private computedSegments: TimelineComputedSegment<V>[] = [];
	private computedDuration = 0;
	private prev = 0;
	private cum = 0;

	constructor(private readonly segments: readonly TimelineSegment<V>[]) {}

	public create(): Readonly<TimelineComputedSegmentCollection<V>> {
		if (!this.computed) {
			this.computeSegments(0, this.segments.length - 1);
			this.computedDuration = this.computedSegments.reduce(
				(duration, { x, time }) =>
					Math.max(duration, time + x.duration),
				0,
			);

			this.computed = true;
		}

		return {
			segments: this
				.computedSegments as readonly TimelineComputedSegment<V>[],
			duration: this.computedDuration,
		} as const;
	}

	private computeSegments(rangeStart: number, rangeEnd: number) {
		for (let i = rangeStart; i <= rangeEnd; ++i) {
			if (this.computedSegments[i]) continue;

			const { x, at, label } = this.segments[i]!;
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
				const index = this.segments.findIndex(
					(segment) => segment.label === at.label,
				);

				if (index < 0)
					throw new IllegalStateError(
						`Timeline label "${at.label}" does not exist.`,
					);

				if (index === i)
					throw new IllegalStateError(
						`Timeline label "${at.label}" cannot reference itself.`,
					);

				if (index < i) {
					const labelled = this.computedSegments[index]!;

					time = labelled.time + (at.offset ?? 0);
				} else if (index > i) {
					this.computeSegments(i + 1, index);

					time =
						this.computedSegments[index]!.time + (at.offset ?? 0);
				} else throw new UnreachableError();
			} else if ('offset' in at) {
				time = this.prev + at.offset;
			} else throw new UnimplementedError();

			const timeAligned = time - x.duration * (at?.align ?? 0);

			this.computedSegments[i] = {
				label,
				x,
				time: timeAligned,
			};

			this.prev = timeAligned + x.duration;
			this.cum = Math.max(this.cum, this.prev);
		}
	}
}
