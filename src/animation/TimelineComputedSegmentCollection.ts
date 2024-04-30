import type { TimelineComputedSegment } from './TimelineComputedSegment.js';

export type TimelineComputedSegmentCollection<V> = {
	readonly segments: readonly TimelineComputedSegment<V>[];
	readonly duration: number;
};
