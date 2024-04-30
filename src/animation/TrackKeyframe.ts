import type { TrackKeyframeValue } from './TrackKeyframeValue.js';
import type { TimeAtEnd } from './TimeAtEnd.js';
import type { TimeAtLabel } from './TimeAtLabel.js';
import type { TimeAtOffset } from './TimeAtOffset.js';
import type { TimeAtStart } from './TimeAtStart.js';
import type { TimeAtTime } from './TimeAtTime.js';
import type { TimeSegment } from './TimeSegment.js';
import type { TimeAt } from './TimeAt.js';
import type { ReadableBezier } from '../bezier/ReadableBezier.js';

export type TrackKeyframe<V extends TrackKeyframeValue = TrackKeyframeValue> =
	TimeSegment<V, TimeAt> & {
		/** The value of the keyframe */
		x: V;

		/**
		 * The placement of the keyframe.
		 *
		 * @see {@linkcode TimeAtTime.time at.time} If you want it to be _absolute_ (a.k.a., _relative_ to the **start of the timeline**).
		 * @see {@linkcode TimeAtOffset.offset at.offset} If you want it to be _relative_ to the **current time**.
		 * @see {@linkcode TimeAtLabel.label at.label} If you want it to be _relative_ to the **start of a segment with the specified label**.
		 * @see {@linkcode TimeAtStart.start at.start} If you want it to be _relative_ to the **start of the timeline**.
		 * @see {@linkcode TimeAtEnd.end at.end} If you want it to be _relative_ to the **end of the timeline**.
		 */
		at?: TimeAt;

		/**
		 * The bezier curve used for interpolation between this keyframe & the
		 * next.
		 */
		bezier?: ReadableBezier;
	};
