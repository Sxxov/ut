import type { TrackComputedKeyframe } from './TrackComputedKeyframe.js';
import type { TrackKeyframeValue } from './TrackKeyframeValue.js';

export interface TrackComputedKeyframeCollecton<V extends TrackKeyframeValue> {
	readonly keyframes: readonly TrackComputedKeyframe<V>[];
	readonly duration: number;
}
