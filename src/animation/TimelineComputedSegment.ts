import type { Animatable } from './Animatable.js';

export interface TimelineComputedSegment {
	x: Animatable<any>;
	label: string | undefined;
	time: number;
}
