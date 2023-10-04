import { IllegalStateError } from '../errors/IllegalStateError.js';
import { UnimplementedError } from '../errors/UnimplementedError.js';
import { UnreachableError } from '../errors/UnreachableError.js';
import type { ReadonlyInvariant } from '../types/ReadonlyInvariant.js';
import { TimelineComputed } from './TimelineComputed.js';
import type { TimelineSegment } from './TimelineSegment.js';
import type { TimelineComputedSegment } from './TimelineComputedSegment.js';

export class Timeline {
	#segments: TimelineSegment[];
	public get segments(): Readonly<TimelineSegment[]> {
		return this.#segments;
	}

	#computed: TimelineComputed | undefined = undefined;
	public get computed() {
		if (this.#computed) return this.#computed;

		const computedSegments: TimelineComputedSegment[] = [];

		Timeline.tryComputeSegments(this.#segments, {
			ref: computedSegments,
		});

		const computed = new TimelineComputed(
			computedSegments as readonly TimelineComputedSegment[],
		);

		this.#computed = computed;

		return computed;
	}

	constructor(from: ReadonlyInvariant<TimelineSegment[]> = [] as const) {
		this.#segments = from as unknown as TimelineSegment[];
	}

	public add(segment: TimelineSegment) {
		this.#segments.push(segment);

		this.#computed = undefined;

		return this;
	}

	public remove(segment: TimelineSegment) {
		this.#segments.splice(this.#segments.indexOf(segment), 1);

		this.#computed = undefined;

		return this;
	}

	public destroy() {
		for (const segment of this.segments) segment.tween.destroy();
		this.#segments.length = 0;
		this.#computed = undefined;
	}

	private static tryComputeSegments(
		segments: TimelineSegment[],
		outComputed: { ref: TimelineComputedSegment[] },
		outPrev = { ref: 0 },
		outCum = { ref: 0 },
		startIndex = 0,
		endIndex = segments.length - 1,
	) {
		for (let i = startIndex; i <= endIndex; ++i) {
			if (outComputed.ref[i]) continue;

			const { tween, at, label } = segments[i]!;
			let time: number;

			if (!at) {
				time = outPrev.ref;
			} else if ('time' in at) {
				time = at.time;
			} else if ('start' in at) {
				time = at.start;
			} else if ('end' in at) {
				time = outCum.ref + at.end;
			} else if ('label' in at) {
				const index = segments.findIndex(
					(segment) => segment.label === at.label,
				);

				if (index < 0)
					throw new IllegalStateError(
						`Timeline label "${at.label}" does not exist.`,
					);

				if (index === i)
					throw new IllegalStateError(
						`Timeline label "${at.label}" cannot reference itself.`,
					);

				if (index < i) {
					const labelled = outComputed.ref[index]!;

					time = labelled.time + (at.offset ?? 0);
				} else if (index > i) {
					this.tryComputeSegments(
						segments,
						outComputed,
						outPrev,
						outCum,
						i + 1,
						index,
					);

					time = outComputed.ref[index]!.time + (at.offset ?? 0);
				} else throw new UnreachableError();
			} else if ('offset' in at) {
				time = outPrev.ref + at.offset;
			} else throw new UnimplementedError();

			const timeAligned = time - tween.duration * (at?.align ?? 0);

			outComputed.ref[i] = {
				label,
				tween,
				time: timeAligned,
			};

			outPrev.ref = timeAligned + tween.duration;
			outCum.ref = Math.max(outCum.ref, outPrev.ref);
		}

		return true;
	}
}
