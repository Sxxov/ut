import type { ReadableBezier } from '../bezier/ReadableBezier.js';
import { IllegalArgumentError } from '../errors/IllegalArgumentError.js';
import { IllegalStateError } from '../errors/IllegalStateError.js';
import { raise } from '../functional/raise.js';
import { clamp01 } from '../math/clamp01.js';
import { lerp } from '../math/lerp.js';
import { map01 } from '../math/map01.js';
import { Store } from '../store/Store.js';
import { Animatable } from './Animatable.js';
import type { TimelineAt } from './TimelineAt.js';
import { Track } from './Track.js';
import type { TrackComputedKeyframe } from './TrackComputedKeyframe.js';
import type { TrackKeyframeValue } from './TrackKeyframeValue.js';

export class Layer<
	V extends TrackKeyframeValue = number,
> extends Animatable<V> {
	public get duration() {
		return this.track.computed.duration;
	}

	public readonly track: Track<V>;

	#start!: V;
	public get start() {
		return this.#start;
	}

	#end!: V;
	public get end() {
		return this.#end;
	}

	constructor(initial?: V);
	constructor(track: Track<V>);
	constructor(trackOrInitial: Track<V> | V) {
		const initial =
			trackOrInitial instanceof Track
				? trackOrInitial.keyframes[0]?.x ??
				  raise(
						new IllegalArgumentError(
							'Cannot create layer with empty track. Consider adding at least one keyframe, or use an initial value instead.',
							'track',
						),
				  )
				: trackOrInitial ?? 0;

		super(new Store<V>(initial));

		const isTrack = trackOrInitial instanceof Track;
		const isScalar = typeof initial === 'number';

		this.track = isTrack ? trackOrInitial : new Track();
		this.track.subscribe(() => {
			if (this.track.keyframes.length > 0) {
				this.#start = (
					isScalar
						? this.getNextTruthyScalarKeyframe(-1)?.x ?? 0
						: this.buildNextTruthyVector(-1)
				) as V;
				this.#end = (
					isScalar
						? this.getNextTruthyScalarKeyframe(
								this.track.keyframes.length,
								-1,
						  )?.x ?? 0
						: this.buildNextTruthyVector(
								this.track.keyframes.length,
								-1,
						  )
				) as V;
			} else {
				this.#start = initial;
				this.#end = initial;
			}

			this.seekToProgress(this.progress);
		});
	}

	public add(x: V, at?: TimelineAt, bezier?: ReadableBezier) {
		this.track.add({ x, at, ...(bezier && { bezier }) });

		return this;
	}

	public has(x: V) {
		return this.track.keyframes.some((keyframe) => keyframe.x === x);
	}

	public remove(x: V) {
		const keyframe = this.track.keyframes.find(
			(keyframe) => keyframe.x === x,
		);
		if (keyframe) this.track.remove(keyframe);

		return this;
	}

	private isTruthyScalar(v: number) {
		return !Number.isNaN(v) && v != null;
	}

	private getNextTruthyScalarKeyframe(
		keyframeIndex: number,
		direction: 1 | -1 = 1,
		predicate?: (v: TrackComputedKeyframe<V>) => boolean,
	) {
		const { keyframes } = this.track.computed;
		const { time: startTime } =
			keyframes[keyframeIndex] ?? direction > 0
				? keyframes[0]!
				: keyframes[keyframes.length - 1]!;

		for (
			let i = direction > 0 ? keyframeIndex + 1 : keyframeIndex - 1;
			direction > 0 ? i < keyframes.length : i >= 0;
			i += direction
		) {
			const keyframe = keyframes[i]!;

			const { x, time: endTime } = keyframe;

			if (typeof x !== 'number')
				throw new IllegalStateError(
					`Keyframe type mismatch, ${this.keyframeValueToString(
						keyframes[keyframeIndex]!.x,
					)} → ${this.keyframeValueToString(x)}.`,
				);
			if (direction > 0 ? startTime > endTime : startTime < endTime)
				continue;

			if (this.isTruthyScalar(x) && (!predicate || predicate(keyframe)))
				return keyframe as TrackComputedKeyframe<number>;
		}
	}

	private getNextTruthyVectorKeyframeAtElement(
		keyframeIndex: number,
		elementIndex: number,
		direction: 1 | -1 = 1,
		predicate?: (v: TrackComputedKeyframe<V>) => boolean,
	) {
		const { keyframes } = this.track.computed;
		const { time: startTime } =
			keyframes[keyframeIndex] ?? direction > 0
				? keyframes[0]!
				: keyframes[keyframes.length - 1]!;

		for (
			let i = direction > 0 ? keyframeIndex + 1 : keyframeIndex - 1;
			direction > 0 ? i < keyframes.length : i >= 0;
			i += direction
		) {
			const keyframe = keyframes[i]!;

			const { x, time: endTime } = keyframe;

			if (!(x instanceof Array))
				throw new IllegalStateError(
					`Keyframe type mismatch, ${this.keyframeValueToString(
						keyframes[keyframeIndex]!.x,
					)} → ${this.keyframeValueToString(x)}.`,
				);
			if (direction > 0 ? startTime > endTime : startTime < endTime)
				continue;

			const value = x[elementIndex]!;

			if (
				this.isTruthyScalar(value) &&
				(!predicate || predicate(keyframe))
			)
				return keyframe as TrackComputedKeyframe<[number, ...number[]]>;
		}
	}

	private buildNextTruthyVector(
		keyframeIndex: number,
		direction: 1 | -1 = 1,
		predicate?: (v: TrackComputedKeyframe<V>) => boolean,
	) {
		const vec: (number | undefined)[] = [undefined];

		for (let i = 0; i < vec.length; ++i) {
			const keyframe = this.getNextTruthyVectorKeyframeAtElement(
				keyframeIndex,
				i,
				direction,
				predicate,
			);

			if (!keyframe) break;

			vec.length = keyframe.x.length;
			vec[i] = keyframe.x[i]!;
		}

		return vec;
	}

	private coalesceVectors<T>(
		source: (T | undefined)[],
		fallback: (T | undefined)[],
	) {
		for (let i = 0; i < Math.max(source.length, fallback.length); ++i)
			source[i] ??= fallback[i];

		return source;
	}

	private toCoalescedVectors<T>(
		source: readonly (T | undefined)[],
		fallback: readonly (T | undefined)[],
	) {
		return Array(Math.max(source.length, fallback.length))
			.fill(0)
			.map((_, i) => source[i] ?? fallback[i]);
	}

	private fillHolesInVector<T>(v: (T | undefined)[], fallback: T) {
		for (let i = 0; i < v.length; ++i) v[i] ??= fallback;

		return v as T[];
	}

	private toHoleFilledVector<T>(v: readonly (T | undefined)[], fallback: T) {
		return v.map((v) => v ?? fallback);
	}

	public override seekToProgress(progress: number): void {
		const time = progress * this.duration;

		const { keyframes } = this.track.computed;
		const i = keyframes.findLastIndex(({ time: t }) => t <= time);

		if (i < 0) {
			this.store.set(this.#start);

			return;
		}

		if (i === keyframes.length - 1) {
			this.store.set(this.#end);

			return;
		}

		const keyframe = keyframes[i]!;
		const viableKeyframes = keyframes.filter(
			({ time: t }) => t === keyframe.time,
		);
		if (viableKeyframes.length > 1 && keyframe.x instanceof Array)
			keyframe.x = viableKeyframes.reduce<(number | undefined)[]>(
				(a, b) => this.toCoalescedVectors(a, b.x as number[]),
				keyframe.x,
			) as V;
		const { time: startTime, bezier } = keyframe;

		if (keyframe.x instanceof Array)
			vector: {
				const curr = keyframe.x.some((v) => !this.isTruthyScalar(v))
					? this.fillHolesInVector(
							this.toCoalescedVectors(
								this.toCoalescedVectors(
									keyframe.x,
									this.buildNextTruthyVector(i, -1),
								),
								this.buildNextTruthyVector(i, 1),
							),
							0,
					  )
					: (keyframe.x as number[]);

				const res = Array<number>(curr.length).fill(0);

				for (const [ii, c] of curr.entries()) {
					const { x: next = curr, time: endTime = this.duration } =
						this.getNextTruthyVectorKeyframeAtElement(i, ii) ?? {};

					const startProgress = startTime / this.duration;
					const endProgress = endTime / this.duration;
					const tweenProgress = bezier.at(
						clamp01(map01(progress, startProgress, endProgress)),
					);
					const tweenValue = lerp(tweenProgress, c, next[ii]!);

					res[ii] = tweenValue;
				}

				this.store.set(res as V);
			}
		else
			scalar: {
				const curr = this.isTruthyScalar(keyframe.x)
					? Number(keyframe.x)
					: this.getNextTruthyScalarKeyframe(i, -1)?.x ?? 0;

				const { x: next = curr, time: endTime = this.duration } =
					this.getNextTruthyScalarKeyframe(i) ?? {};

				const startProgress = startTime / this.duration;
				const endProgress = endTime / this.duration;
				const tweenProgress = bezier.at(
					clamp01(map01(progress, startProgress, endProgress)),
				);
				const res = lerp(tweenProgress, curr, next);

				this.store.set(res as V);
			}

		this.progress = progress;
	}
	/* eslint-enable */

	public override destroy(): void {
		super.destroy();
		this.track.destroy();
	}

	private assertKeyframeTypeMatch(
		a: TrackComputedKeyframe<V>,
		b: TrackComputedKeyframe<V>,
	) {
		if (typeof a.x !== typeof b.x)
			throw new IllegalStateError(
				`Keyframe type mismatch, ${this.keyframeValueToString(
					a.x,
				)} → ${this.keyframeValueToString(b.x)}.`,
			);
	}

	private keyframeValueToString(x: TrackKeyframeValue) {
		return x instanceof Array
			? `<${x[0].constructor.name}[${x.length}]>([${x.join(', ')}])`
			: `<${x.constructor.name}>(${(() => {
					try {
						return JSON.stringify(x, undefined, '\t');
					} catch {
						return String(x);
					}
			  })()})`;
	}
}
