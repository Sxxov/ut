import { Store } from '../store/Store.js';

interface IDimens {
	height: number;
	width: number;
}
const hasWindow = typeof window !== String(undefined);
const initialDimens: IDimens = hasWindow
	? { height: window.innerHeight, width: window.innerWidth }
	: { height: 0, width: 0 };

export const dimensions = new Store({
	inner: initialDimens,
	outer: initialDimens,
	client: initialDimens,
	hasTouch: false,
});
export const inner = new Store<IDimens>(initialDimens);
export const outer = new Store<IDimens>(initialDimens);
export const client = new Store<IDimens>(initialDimens);
export const hasTouch = new Store<boolean>(false);

const onResize = () => {
	inner.set({
		height: window.innerHeight,
		width: window.innerWidth,
	});
	outer.set({
		height: window.outerHeight,
		width: window.outerWidth,
	});
	client.set({
		height: document.documentElement.clientHeight,
		width: document.documentElement.clientWidth,
	});
	hasTouch.set('ontouchstart' in document.documentElement);

	dimensions.set({
		inner: inner.get(),
		outer: outer.get(),
		client: client.get(),
		hasTouch: hasTouch.get(),
	});
};

if (hasWindow) {
	onResize();
	window.addEventListener('resize', onResize);
}
