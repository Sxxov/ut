export type TSubscriber<T> = (v: T) => void;
export type TInvalidator = () => void;
export type TUnsubscriber = () => void;

export interface IReadableStore<T> {
	get(): T;
	subscribe(
		onChanged: TSubscriber<T>,
		onInvalidate?: TInvalidator | undefined,
	): TUnsubscriber;
	subscribeLazy(
		onChanged: TSubscriber<T>,
		onInvalidate?: TInvalidator | undefined,
	): TUnsubscriber;
	trigger(): void;
	destroy(): void;
	derive<R>(fn: (v: T) => R): IReadableStore<R>;
}
