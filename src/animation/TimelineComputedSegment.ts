import type { Tween } from './Tween.js';

export interface TimelineComputedSegment {
	label: string | undefined;
	tween: Tween;
	time: number;
}
