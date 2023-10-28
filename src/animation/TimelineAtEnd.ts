import type { TimelineAtStart } from './TimelineAtStart.js';
import type { TimelineAtAlign } from './TimelineAtAlign.js';
import type { OrAnyNumber } from '../types/OrAnyNumber.js';

export interface TimelineAtEnd {
	/**
	 * Place the segment _relative_ to the **end of the timeline**.
	 *
	 * **Note:** This places the segment starting at the end of the timeline by
	 * default. Use {@linkcode TimelineAtAlign.align at.align} of `1` to have it
	 * start from the end.
	 *
	 * @see {@linkcode TimelineAtStart.start at.start} If you want it to be _relative_ to the **start of the timeline**.
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	end: OrAnyNumber<0>;
}
