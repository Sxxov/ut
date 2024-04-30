import { type Point } from '../viewport/Point.js';
import { clamp } from '../math/clamp.js';
import { Store } from '../store/Store.js';
import { resolvePointerFromEvent } from '../viewport/resolvePointerFromEvent.js';

const touchStore = new Store<Point>({ x: 0, y: 0 });

const [width, height] = [0, 0];
const move = (x: number, y: number) => {
	const { clientWidth, clientHeight } = document.documentElement;

	touchStore.set({
		x: clamp(x, 0, clientWidth - width),
		y: clamp(y, 0, clientHeight - height),
	});
};

const onTouchMove = (e: TouchEvent) => {
	if (navigator.maxTouchPoints <= 0) return;

	const point = resolvePointerFromEvent(e);
	const { x: ex, y: ey } = point;

	move(ex, ey);
};

if (typeof window !== 'undefined') {
	window.addEventListener('touchmove', onTouchMove);
	window.addEventListener('touchstart', onTouchMove);

	move(0, 0);
}

export const touch = touchStore.supply;
