import type { CompositionFrame } from './CompositionFrame.js';
import type { TrackKeyframeValue } from './TrackKeyframeValue.js';

export type TimelineSegmentValue =
	| number
	| TrackKeyframeValue
	| CompositionFrame;
