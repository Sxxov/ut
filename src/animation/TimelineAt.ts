import type { TimelineAtAlign } from './TimelineAtAlign.js';
import type { TimelineAtEnd } from './TimelineAtEnd.js';
import type { TimelineAtLabel } from './TimelineAtLabel.js';
import type { TimelineAtOffset } from './TimelineAtOffset.js';
import type { TimelineAtStart } from './TimelineAtStart.js';
import type { TimelineAtTime } from './TimelineAtTime.js';

export type TimelineAt =
	| ((
			| TimelineAtOffset
			| TimelineAtTime
			| TimelineAtLabel
			| TimelineAtStart
			| TimelineAtEnd
	  ) &
			Partial<TimelineAtAlign>)
	| undefined;
