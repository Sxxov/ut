import type {
	IReadableStore,
	TInvalidator,
	TSubscriber,
} from './IReadableStore.js';
import type { Store } from './Store.js';

export class Supply<T> implements IReadableStore<T> {
	constructor(protected store: Store<T>) {}

	public get() {
		return this.store.get();
	}

	public subscribe(
		onChanged: TSubscriber<T>,
		onInvalidate: TInvalidator | undefined = undefined,
	) {
		return this.store.subscribe(onChanged, onInvalidate);
	}

	public subscribeLazy(
		onChanged: TSubscriber<T>,
		onInvalidate?: TInvalidator | undefined,
	) {
		return this.store.subscribeLazy(onChanged, onInvalidate);
	}

	public trigger() {
		this.store.trigger();
	}

	public destroy() {
		this.store.destroy();
	}
}
