import type { TimelineAtTime } from './TimelineAtTime.js';
import type { TimelineAtAlign } from './TimelineAtAlign.js';

export interface TimelineAtOffset {
	/**
	 * Place the segment _relative_ to the **current time**.
	 *
	 * @see {@linkcode TimelineAtTime.time at.time} If you want it to be _absolute_ (a.k.a., _relative_ to the **start of the timeline**).
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	offset: number;
}
