import type { TimelineAtTime } from './TimelineAtTime.js';
import type { TimelineAtEnd } from './TimelineAtEnd.js';
import type { TimelineAtAlign } from './TimelineAtAlign.js';

export interface TimelineAtStart {
	/**
	 * Place the segment _relative_ to the **start of the timeline**.
	 *
	 * **Note:** This is equivalent to {@linkcode TimelineAtTime.time at.time},
	 * but it may be more explicit for when you want to place a segment
	 * specifically at the start of the timeline.
	 *
	 * @see {@linkcode TimelineAtEnd.end at.end} If you want it to be _relative_ to the **end of the timeline**.
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	start: 0 | (number & {});
}
