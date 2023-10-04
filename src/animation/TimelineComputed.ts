import type { ReadonlyInvariant } from '../types/ReadonlyInvariant.js';
import type { TimelineComputedSegment } from './TimelineComputedSegment.js';

export class TimelineComputed {
	public readonly segments: readonly TimelineComputedSegment[];
	public readonly duration: number;
	public readonly start: number;
	public readonly end: number;

	constructor(segments: ReadonlyInvariant<TimelineComputedSegment[]>) {
		this.segments = segments;
		this.duration = this.segments.reduce(
			(duration, { tween, time }) =>
				Math.max(duration, time + tween.duration),
			0,
		);
		this.start = Math.min(...segments.map(({ tween }) => tween.start));
		this.end = Math.max(...segments.map(({ tween }) => tween.end));
	}
}
