import type { TimeAtTime } from './TimeAtTime.js';
import type { TimeAtEnd } from './TimeAtEnd.js';
import type { TimelineAtAlign } from './TimelineAtAlign.js';
import type { OrAnyNumber } from '../types/OrAnyNumber.js';

export interface TimeAtStart {
	type?: 'start';
	/**
	 * Place the segment _relative_ to the **start of the timeline**.
	 *
	 * **Note:** This is equivalent to {@linkcode TimeAtTime.time at.time}, but
	 * it may be more explicit for when you want to place a segment specifically
	 * at the start of the timeline.
	 *
	 * @see {@linkcode TimeAtEnd.end at.end} If you want it to be _relative_ to the **end of the timeline**.
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	start: OrAnyNumber<0>;
}
