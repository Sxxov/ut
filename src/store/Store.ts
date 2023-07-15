// copied from svelte's implementation

import type { IReadableStore } from './IReadableStore.js';
import { Supply } from './Supply.js';

type TSubscriber<T> = (v: T) => void;
type TInvalidator = () => void;
type TSubscriberAndInvalidator<T> = [
	subscriber: TSubscriber<T>,
	invalidator: TInvalidator | undefined,
];
type TUnsubscriber = () => void;
type TUpdater<T> = (v: T) => T;
type TStartStopNotifier<T> = (set: TSubscriber<T>) => TUnsubscriber | undefined;

export type TStorify<T> = T extends infer U ? Store<U> : never;

export class Store<T = unknown> implements IReadableStore<T> {
	private subscriberAndInvalidators = new Set<TSubscriberAndInvalidator<T>>();
	private onStopped: TUnsubscriber | undefined = undefined;

	#supply: Supply<T> | undefined = undefined;
	public get supply() {
		return (this.#supply ??= new Supply(this));
	}

	constructor(
		protected value: T,
		private onStarted?: TStartStopNotifier<T>,
	) {}

	public set(v: T) {
		if (!Store.neq(this.value, v)) return;

		this.value = v;
		this.trigger();
	}

	public update(fn: TUpdater<T>) {
		this.set(fn(this.value));
	}

	public get() {
		return this.value;
	}

	public trigger() {
		if (this.subscriberAndInvalidators.size <= 0) return;

		for (const [, invalidator] of this.subscriberAndInvalidators)
			invalidator?.();

		for (const [subscriber] of this.subscriberAndInvalidators)
			subscriber(this.value);
	}

	public subscribe(
		onChanged: TSubscriber<T>,
		onInvalidate: TInvalidator | undefined = undefined,
	) {
		onChanged(this.value);
		return this.subscribeLazy(onChanged, onInvalidate);
	}

	public subscribeLazy(
		onChanged: TSubscriber<T>,
		onInvalidate: TInvalidator | undefined = undefined,
	) {
		const subscriberAndInvalidator: TSubscriberAndInvalidator<T> = [
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
		}) as TUnsubscriber;
	}

	public destroy() {
		this.subscriberAndInvalidators.clear();
		this.onStopped?.();
		this.onStopped = undefined;
	}

	private static neq(a: unknown, b: unknown) {
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

	public derive<R>(fn: (v: T) => R, onStarted?: Store<R>['onStarted']) {
		const store = new Store(fn(this.value), onStarted);

		this.subscribeLazy((v) => {
			store.set(fn(v));
		});

		return store;
	}
}
