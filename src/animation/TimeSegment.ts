import type { TimeAtLabel } from './TimeAtLabel.js';

export interface TimeSegment<Target, At extends Record<any, any> | undefined> {
	/** The target to be placed. */
	x: Target;
	/**
	 * A label which can be referred to by other segments via
	 * {@linkcode TimeAtLabel.label at.label}.
	 */
	label?: string;
	/** The placement of the segment. */
	at?: At;
}
