import type { TimelineAtAlign } from './TimelineAtAlign.js';
import type { TimelineAtOffset } from './TimelineAtOffset.js';

export interface TimelineAtTime {
	/**
	 * Place the segment _absolutely_ (a.k.a., _relatively_ from the **start of
	 * the timeline**).
	 *
	 * @see {@linkcode TimelineAtOffset.offset at.offset} If you want it to be _relative_ to the **current time**.
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	time: number;
}
