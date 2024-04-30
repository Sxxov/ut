// copied from svelte's implementation

import type {
	Invalidator,
	ReadableStore,
	StartStopNotifier,
	Subscriber,
	SubscriberAndInvalidator,
	Unsubscriber,
} from './ReadableStore.js';
import type { Updater } from './WritableStore.js';
import { Supply } from './Supply.js';

export type Storify<T> = T extends infer U ? Store<U> : never;

export class Store<T = unknown> implements ReadableStore<T> {
	protected static neq(a: unknown, b: unknown) {
		/* eslint-disable no-negated-condition, no-self-compare, eqeqeq */
		return (
			a != a
				? b == b
				: a !== b ||
				  (a && typeof a === 'object') ||
				  typeof a === 'function'!
		) as boolean;
		/* eslint-enable */
	}

	private readonly subscriberAndInvalidators = new Set<
		SubscriberAndInvalidator<T>
	>();

	private onStopped: Unsubscriber | undefined = undefined;

	#supply: Supply<T> | undefined = undefined;
	public get supply() {
		return (this.#supply ??= new Supply(this));
	}

	constructor(
		protected value: T,
		private readonly onStarted?: StartStopNotifier<T>,
	) {}

	public set(v: T) {
		if (!Store.neq(this.get(), v)) return;

		this.value = v;
		this.trigger();
	}

	public update(fn: Updater<T>) {
		this.set(fn(this.get()));
	}

	public get() {
		return this.value;
	}

	public trigger() {
		if (this.subscriberAndInvalidators.size <= 0) return;

		for (const [, invalidator] of this.subscriberAndInvalidators)
			invalidator?.();

		for (const [subscriber] of this.subscriberAndInvalidators)
			subscriber(this.get());
	}

	public subscribe(
		onChanged: Subscriber<T>,
		onInvalidate: Invalidator | undefined = undefined,
	) {
		onChanged(this.get());
		return this.subscribeLazy(onChanged, onInvalidate);
	}

	public subscribeLazy(
		onChanged: Subscriber<T>,
		onInvalidate: Invalidator | undefined = undefined,
	) {
		const subscriberAndInvalidator: SubscriberAndInvalidator<T> = [
			onChanged,
			onInvalidate,
		];

		this.subscriberAndInvalidators.add(subscriberAndInvalidator);

		const shouldInvokeStarted = this.subscriberAndInvalidators.size <= 1;
		if (shouldInvokeStarted && this.onStarted)
			this.onStopped = this.onStarted(this.set.bind(this));

		return (() => {
			this.subscriberAndInvalidators.delete(subscriberAndInvalidator);

			const shouldInvokeStopped =
				this.subscriberAndInvalidators.size <= 0;
			if (shouldInvokeStopped && this.onStopped) {
				this.onStopped();
				this.onStopped = undefined;
			}
		}) as Unsubscriber;
	}

	public destroy() {
		this.subscriberAndInvalidators.clear();
		this.onStopped?.();
		this.onStopped = undefined;
	}

	public receive(from: ReadableStore<T>) {
		return from.subscribe((v) => {
			this.set(v);
		});
	}

	public derive<R>(fn: (v: T) => R, onStarted?: Store<R>['onStarted']) {
		const store = new Store(fn(this.get()), onStarted);

		this.subscribeLazy((v) => {
			store.set(fn(v));
		});

		return store;
	}
}
