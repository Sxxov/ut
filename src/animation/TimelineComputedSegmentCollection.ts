import type { TimelineComputedSegment } from './TimelineComputedSegment.js';

export interface TimelineComputedSegmentCollection<V> {
	readonly segments: readonly TimelineComputedSegment<V>[];
	readonly duration: number;
}
