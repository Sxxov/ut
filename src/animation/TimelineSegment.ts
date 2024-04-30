import type { Animatable } from './Animatable.js';
import type { TimeAtEnd } from './TimeAtEnd.js';
import type { TimeAtLabel } from './TimeAtLabel.js';
import type { TimeAtOffset } from './TimeAtOffset.js';
import type { TimeAtStart } from './TimeAtStart.js';
import type { TimeAtTime } from './TimeAtTime.js';
import type { TimeSegment } from './TimeSegment.js';
import type { TimelineAt } from './TimelineAt.js';
import type { TimelineSegmentValue } from './TimelineSegmentValue.js';

export type TimelineSegment<V = TimelineSegmentValue> = TimeSegment<
	Animatable<V>,
	TimelineAt
> & {
	/** The animatable to be placed */
	x: Animatable<V>;

	/**
	 * The placement of the animatable.
	 *
	 * @see {@linkcode TimeAtTime.time at.time} If you want it to be _absolute_ (a.k.a., _relative_ to the **start of the timeline**).
	 * @see {@linkcode TimeAtOffset.offset at.offset} If you want it to be _relative_ to the **current time**.
	 * @see {@linkcode TimeAtLabel.label at.label} If you want it to be _relative_ to the **start of a segment with the specified label**.
	 * @see {@linkcode TimeAtStart.start at.start} If you want it to be _relative_ to the **start of the timeline**.
	 * @see {@linkcode TimeAtEnd.end at.end} If you want it to be _relative_ to the **end of the timeline**.
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	at?: TimelineAt;
};
