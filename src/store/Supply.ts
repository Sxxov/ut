import type {
	ReadableStore,
	Invalidator,
	Subscriber,
} from './ReadableStore.js';
import type { Store } from './Store.js';

export class Supply<T> implements ReadableStore<T> {
	constructor(protected store: Store<T>) {}

	public get() {
		return this.store.get();
	}

	public subscribe(
		onChanged: Subscriber<T>,
		onInvalidate: Invalidator | undefined = undefined,
	) {
		return this.store.subscribe(onChanged, onInvalidate);
	}

	public subscribeLazy(
		onChanged: Subscriber<T>,
		onInvalidate?: Invalidator | undefined,
	) {
		return this.store.subscribeLazy(onChanged, onInvalidate);
	}

	public trigger() {
		this.store.trigger();
	}

	public destroy() {
		this.store.destroy();
	}

	public derive<R>(fn: (v: T) => R, onStarted?: Store<R>['onStarted']) {
		return this.store.derive(fn, onStarted).supply;
	}
}
