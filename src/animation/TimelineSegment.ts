import type { TimelineAt } from './TimelineAt.js';
import type { TimelineAtLabel } from './TimelineAtLabel.js';
import type { TimelineAtOffset } from './TimelineAtOffset.js';
import type { TimelineAtStart } from './TimelineAtStart.js';
import type { TimelineAtEnd } from './TimelineAtEnd.js';
import type { TimelineAtAlign } from './TimelineAtAlign.js';
import type { TimelineAtTime } from './TimelineAtTime.js';
import type { Animatable } from './Animatable.js';

export interface TimelineSegment {
	/** The animatable to be placed. */
	x: Animatable<any>;
	/**
	 * A label which can be referred to by other segments via
	 * {@linkcode TimelineAtLabel.label at.label}.
	 */
	label?: string;
	/**
	 * The placement of the segment.
	 *
	 * @see {@linkcode TimelineAtTime.time at.time} If you want it to be _absolute_ (a.k.a., _relative_ to the **start of the timeline**).
	 * @see {@linkcode TimelineAtOffset.offset at.offset} If you want it to be _relative_ to the **current time**.
	 * @see {@linkcode TimelineAtLabel.label at.label} If you want it to be _relative_ to the **start of a segment with the specified label**.
	 * @see {@linkcode TimelineAtStart.start at.start} If you want it to be _relative_ to the **start of the timeline**.
	 * @see {@linkcode TimelineAtEnd.end at.end} If you want it to be _relative_ to the **end of the timeline**.
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	at?: TimelineAt;
}
