import type { TimelineAtAlign } from './TimelineAtAlign.js';
import type { TimeAtOffset } from './TimeAtOffset.js';

export interface TimeAtTime {
	type?: 'time';
	/**
	 * Place the segment _absolutely_ (a.k.a., _relatively_ from the **start of
	 * the timeline**).
	 *
	 * @see {@linkcode TimeAtOffset.offset at.offset} If you want it to be _relative_ to the **current time**.
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	time: number;
}
