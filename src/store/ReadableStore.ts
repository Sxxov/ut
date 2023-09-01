export type Subscriber<T> = (v: T) => void;
export type Invalidator = () => void;
export type Unsubscriber = () => void;
export type SubscriberAndInvalidator<T> = [
	subscriber: Subscriber<T>,
	invalidator: Invalidator | undefined,
];
export type StartStopNotifier<T> = (
	set: Subscriber<T>,
) => Unsubscriber | undefined;

export interface ReadableStore<T> {
	get(): T;
	subscribe(
		onChanged: Subscriber<T>,
		onInvalidate?: Invalidator | undefined,
	): Unsubscriber;
	subscribeLazy(
		onChanged: Subscriber<T>,
		onInvalidate?: Invalidator | undefined,
	): Unsubscriber;
	trigger(): void;
	destroy(): void;
	derive<R>(fn: (v: T) => R): ReadableStore<R>;
}
