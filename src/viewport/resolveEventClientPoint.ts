import { type Point } from './Point.js';

/** @deprecated Use `pointer*` events */
export const resolveEventClientPoint = (
	event: MouseEvent | TouchEvent,
): Point =>
	typeof TouchEvent !== 'undefined' && event instanceof TouchEvent
		? {
				x:
					event.touches[0]?.clientX ??
					event.changedTouches[0]?.clientX ??
					NaN,
				y:
					event.touches[0]?.clientY ??
					event.changedTouches[0]?.clientY ??
					NaN,
		  }
		: typeof MouseEvent !== 'undefined' && event instanceof MouseEvent
		? { x: event.clientX, y: event.clientY }
		: { x: NaN, y: NaN };
