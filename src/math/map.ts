import { lerp } from './lerp.js';
import { map01 } from './map01.js';

export const map = (
	t: number,
	rangeStart: number,
	rangeEnd: number,
	domainStart: number,
	domainEnd: number,
) => lerp(map01(t, rangeStart, rangeEnd), domainStart, domainEnd);
