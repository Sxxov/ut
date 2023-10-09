import type { ReadonlyInvariant } from '../types/ReadonlyInvariant.js';
import type { TimelineComputedSegment } from './TimelineComputedSegment.js';

export class TimelineComputed {
	public readonly segments: readonly TimelineComputedSegment[];
	public readonly duration: number;

	constructor(segments: ReadonlyInvariant<TimelineComputedSegment[]>) {
		this.segments = segments;
		this.duration = this.segments.reduce(
			(duration, { tween, time }) =>
				Math.max(duration, time + tween.duration),
			0,
		);
	}
}
