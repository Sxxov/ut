import type { ReadableBezier } from '../bezier/ReadableBezier.js';
import type { TrackKeyframeValue } from './TrackKeyframeValue.js';

export interface TrackComputedKeyframe<V extends TrackKeyframeValue> {
	x: V;
	label: string | undefined;
	time: number;
	bezier: ReadableBezier;
}
