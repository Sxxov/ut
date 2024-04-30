import { Store } from '../store/Store.js';

const store = new Store(false);
export const scrolling = store.supply;

// TODO: check back when `scrollend` event is more supported
// https://caniuse.com/mdn-api_element_scrollend_event
if (typeof window !== 'undefined') {
	let timer: ReturnType<typeof setTimeout> | undefined;

	window.addEventListener('scroll', () => {
		if (timer) clearTimeout(timer);
		store.set(true);
		timer = setTimeout(() => {
			store.set(false);
		}, 100);
	});

	window.addEventListener('scrollend', () => {
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}

		store.set(false);
	});
}
