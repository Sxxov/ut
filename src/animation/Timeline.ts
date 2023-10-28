import { Store } from '../store/Store.js';
import { Supply } from '../store/Supply.js';
import type { ReadonlyInvariant } from '../types/ReadonlyInvariant.js';
import type { Unreadonly } from '../types/Unreadonly.js';
import { type TimelineComputedSegmentCollection } from './TimelineComputedSegmentCollection.js';
import { TimelineComputedSegmentCollectionFactory } from './TimelineComputedSegmentCollectionFactory.js';
import type { TimelineSegment } from './TimelineSegment.js';

export class Timeline<V> extends Supply<Readonly<TimelineSegment<V>[]>> {
	public get segments(): Readonly<TimelineSegment<V>[]> {
		return this.get();
	}

	#computed: TimelineComputedSegmentCollection<V> | undefined = undefined;
	public get computed() {
		return (this.#computed ??= new TimelineComputedSegmentCollectionFactory(
			this.segments,
		).create());
	}

	constructor(from: ReadonlyInvariant<TimelineSegment<V>[]> = [] as const) {
		super(new Store(from));
	}

	public add(segment: TimelineSegment<V>) {
		(this.segments as Unreadonly<typeof this.segments>).push(segment);
		this.#computed = undefined;
		this.trigger();

		return this;
	}

	public has(segment: TimelineSegment<V>) {
		return this.segments.includes(segment);
	}

	public remove(segment: TimelineSegment<V>) {
		(this.segments as Unreadonly<typeof this.segments>).splice(
			this.segments.indexOf(segment),
			1,
		);
		this.#computed = undefined;
		this.trigger();

		return this;
	}

	public override destroy() {
		for (const segment of this.segments) segment.x.destroy();
		this.#computed = undefined;

		super.destroy();
	}
}
