import { Store } from '../store/Store.js';
import { Supply } from '../store/Supply.js';
import type { ReadonlyInvariant } from '../types/ReadonlyInvariant.js';
import type { Unreadonly } from '../types/Unreadonly.js';
import type { TrackComputedKeyframeCollecton } from './TrackComputedKeyframeCollection.js';
import { TrackComputedKeyframeCollectionFactory } from './TrackComputedKeyframeCollectionFactory.js';
import type { TrackKeyframe } from './TrackKeyframe.js';
import type { TrackKeyframeValue } from './TrackKeyframeValue.js';

export class Track<
	V extends TrackKeyframeValue = TrackKeyframeValue,
> extends Supply<Readonly<TrackKeyframe<V>[]>> {
	public get keyframes(): Readonly<TrackKeyframe<V>[]> {
		return this.get();
	}

	#computed: TrackComputedKeyframeCollecton<V> | undefined = undefined;
	public get computed() {
		return (this.#computed ??= new TrackComputedKeyframeCollectionFactory(
			this.keyframes,
		).create());
	}

	constructor(from: ReadonlyInvariant<TrackKeyframe<V>[]> = [] as const) {
		super(new Store(from));
	}

	public add(segment: TrackKeyframe<V>) {
		(this.keyframes as Unreadonly<typeof this.keyframes>).push(segment);
		this.#computed = undefined;
		this.trigger();

		return this;
	}

	public has(segment: TrackKeyframe<V>) {
		return this.keyframes.includes(segment);
	}

	public remove(segment: TrackKeyframe<V>) {
		(this.keyframes as Unreadonly<typeof this.keyframes>).splice(
			this.keyframes.indexOf(segment),
			1,
		);
		this.#computed = undefined;
		this.trigger();

		return this;
	}

	public override destroy() {
		this.#computed = undefined;

		super.destroy();
	}
}
