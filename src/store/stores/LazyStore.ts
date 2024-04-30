import { lazy } from '../../functional/lazy.js';
import { type StartStopNotifier } from '../ReadableStore.js';
import { Store } from '../Store.js';

/**
 * Store that only runs `factory` to initialise itself when a consumer requires
 * it
 */
export class LazyStore<T = unknown> extends Store<T> {
	private initialised = false;
	private readonly lazy: ReturnType<typeof lazy>;

	constructor(factory: () => T, onStarted?: StartStopNotifier<T>) {
		super(undefined as never, onStarted);

		this.lazy = lazy(factory);
	}

	public override get() {
		if (!this.initialised) return this.lazy() as T;

		return super.get();
	}

	public override set(v: T) {
		this.initialised ??= true;

		super.set(v);
	}
}
