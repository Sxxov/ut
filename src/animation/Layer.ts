import { Bezier } from '../bezier/Bezier.js';
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

	#start: V;
	public get start() {
		return this.#start;
	}

	#end: V;
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

		this.#start = initial;
		this.track = isTrack ? trackOrInitial : new Track();
		this.#end =
			isTrack && this.track.keyframes.length > 0
				? this.track.keyframes[this.track.keyframes.length - 1]?.x ??
				  initial
				: initial;

		this.track.subscribeLazy(() => {
			if (this.track.keyframes.length > 0) {
				this.#start = this.track.keyframes[0]!.x;
				this.#end =
					this.track.keyframes[this.track.keyframes.length - 1]!.x;
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

	private getNextTruthyScalar(keyframeIndex: number) {
		const { keyframes } = this.track.computed;
		const { time: startTime } = keyframes[keyframeIndex]!;

		for (let i = keyframeIndex + 1; i < keyframes.length; ++i) {
			const keyframe = keyframes[i]!;

			const { x, time: endTime } = keyframe;

			if (typeof x !== 'number')
				throw new IllegalStateError(
					`Keyframe type mismatch, ${this.keyframeValueToString(
						keyframes[keyframeIndex]!.x,
					)} → ${this.keyframeValueToString(x)}.`,
				);
			if (startTime > endTime) continue;

			if (!Number.isNaN(x) && x != null)
				return keyframe as TrackComputedKeyframe<number>;
		}
	}

	private getNextTruthyVectorAtElement(
		keyframeIndex: number,
		elementIndex: number,
	) {
		const { keyframes } = this.track.computed;
		const { time: startTime } = keyframes[keyframeIndex]!;

		for (let i = keyframeIndex + 1; i < keyframes.length; ++i) {
			const keyframe = keyframes[i]!;

			const { x, time: endTime } = keyframe;

			if (!(x instanceof Array))
				throw new IllegalStateError(
					`Keyframe type mismatch, ${this.keyframeValueToString(
						keyframes[keyframeIndex]!.x,
					)} → ${this.keyframeValueToString(x)}.`,
				);
			if (startTime > endTime) continue;

			const value = x[elementIndex]!;

			if (!Number.isNaN(value) && value != null)
				return keyframe as TrackComputedKeyframe<[number, ...number[]]>;
		}
	}

	public override seekToProgress(progress: number): void {
		const time = progress * this.duration;

		const { keyframes } = this.track.computed;
		rest: {
			for (let i = 0; i < keyframes.length; ++i) {
				const keyframe = keyframes[i]!;

				const { x: curr, time: startTime, bezier } = keyframe;

				if (time < startTime) continue;

				if (curr instanceof Array)
					vector: {
						const res = Array<number>(curr.length).fill(0);

						for (const [ii, c] of curr.entries()) {
							const {
								x: next = curr,
								time: endTime = this.duration,
							} = this.getNextTruthyVectorAtElement(i, ii) ?? {};

							const startProgress = startTime / this.duration;
							const endProgress = endTime / this.duration;
							const tweenProgress = bezier.at(
								clamp01(
									map01(progress, startProgress, endProgress),
								),
							);
							const tweenValue = lerp(
								tweenProgress,
								c,
								next[ii]!,
							);

							res[ii] = tweenValue;
						}

						this.store.set(res as V);
					}
				else
					scalar: {
						const {
							x: next = curr,
							time: endTime = this.duration,
						} = this.getNextTruthyScalar(i) ?? {};

						const startProgress = startTime / this.duration;
						const endProgress = endTime / this.duration;
						const tweenProgress = bezier.at(
							clamp01(
								map01(progress, startProgress, endProgress),
							),
						);
						const res = lerp(tweenProgress, curr, next);

						this.store.set(res as V);
					}

				break rest;
			}

			first: {
				// if the time is before the first keyframe, use the initial value

				this.store.set(this.#start);
			}
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
