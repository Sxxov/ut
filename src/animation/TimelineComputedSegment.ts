import type { Animatable } from './Animatable.js';

export interface TimelineComputedSegment<V> {
	x: Animatable<V>;
	label: string | undefined;
	time: number;
}
