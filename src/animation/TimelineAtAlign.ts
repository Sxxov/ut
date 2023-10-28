import type { OrAnyNumber } from '../types/OrAnyNumber.js';

export interface TimelineAtAlign {
	/**
	 * The alignment of the segment on the timeline, in the range of 0-1, where:
	 *
	 * - `0` places the segment starting at its specified time,
	 * - `1` places the segment ending at its specified time.
	 *
	 * **Note:** You may specify a number outside of this range to indicate a
	 * percentage of the segment's duration, e.g. 1.5 would place the segment's
	 * end at 150% of its duration.
	 */
	align: OrAnyNumber<0 | 0.5 | 1>;
}
