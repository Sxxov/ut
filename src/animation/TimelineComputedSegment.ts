import type { Animatable } from './Animatable.js';

export type TimelineComputedSegment<V> = {
	x: Animatable<V>;
	label: string | undefined;
	time: number;
};
