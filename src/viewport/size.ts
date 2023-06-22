import { Store } from '../store/Store.js';
import { type ISize } from './ISize.js';

const hasWindow = typeof window !== String(undefined);
const initialSize: ISize = hasWindow
	? { height: window.innerHeight, width: window.innerWidth }
	: { height: 0, width: 0 };

export const size = new Store({
	inner: initialSize,
	outer: initialSize,
	client: initialSize,
	hasTouch: false,
});
export const inner = new Store<ISize>(initialSize);
export const outer = new Store<ISize>(initialSize);
export const client = new Store<ISize>(initialSize);
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

	size.set({
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
