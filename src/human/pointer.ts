import { type Point } from '../viewport/Point.js';
import { clamp } from '../math/clamp.js';
import { Store } from '../store/Store.js';
import { resolvePointerFromEvent } from '../viewport/resolvePointerFromEvent.js';

const pointerStore = new Store<Point>({ x: 0, y: 0 });

const [width, height] = [0, 0];
const move = (x: number, y: number) => {
	const { clientWidth, clientHeight } = document.documentElement;

	pointerStore.set({
		x: clamp(x, 0, clientWidth - width),
		y: clamp(y, 0, clientHeight - height),
	});
};

const onPointerMove = (e: MouseEvent | TouchEvent) => {
	const point = resolvePointerFromEvent(e);
	const { x: ex, y: ey } = point;

	move(ex, ey);
};

if (typeof window !== 'undefined') {
	window.addEventListener('mousemove', onPointerMove);
	window.addEventListener('touchmove', onPointerMove);
	window.addEventListener('touchstart', onPointerMove);

	move(0, 0);
}

export const pointer = pointerStore.supply;
