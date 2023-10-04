import type { TimelineAtAlign } from './TimelineAtAlign.js';
import type { TimelineAtOffset } from './TimelineAtOffset.js';

export interface TimelineAtLabel {
	/**
	 * Place the segment _relative_ to the **start of a segment with the
	 * specified label**.
	 *
	 * @see {@linkcode TimelineAtAlign.align at.align} If you want to align its placement _relative_ to the **start or end of itself**.
	 */
	label: string;
	/**
	 * Offset _relative_ to the **start of a segment with the specified label**.
	 *
	 * **Note:** Remove `label` if you want it to be _relative_ to the **current
	 * time** ({@linkcode TimelineAtOffset.offset at.offset}).
	 */
	offset?: number;
}
