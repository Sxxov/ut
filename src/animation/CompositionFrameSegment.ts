import type { Animatable } from './Animatable.js';
import type { Composition } from './Composition.js';

export type CompositionFrameSegment = {
	x: Animatable<any>;
	value: number;
	composition: Composition;
};
