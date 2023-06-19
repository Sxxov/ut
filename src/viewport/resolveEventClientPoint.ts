import { type IPoint } from './IPoint.js';

export const resolveEventClientPoint = (
	event: MouseEvent | TouchEvent,
): IPoint =>
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
