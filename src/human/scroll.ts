import { SuppressibleStore } from '../store/stores/SuppressibleStore';

export const scrollY = new SuppressibleStore(0);
scrollY.subscribeLazy((value) => {
	window.scrollTo({ top: value });
});
export const scrollX = new SuppressibleStore(0);
scrollX.subscribeLazy((value) => {
	window.scrollTo({ left: value });
});

const update = () => {
	// use page*Offset as it's read-only & can't be clobbered
	scrollY.set(window.pageYOffset, true);
	scrollX.set(window.pageXOffset, true);
};

if (typeof window !== 'undefined') {
	update();
	window.addEventListener('scroll', update);
}
