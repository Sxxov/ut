import type { Composition } from './Composition.js';
import type { Tween } from './Tween.js';

export interface CompositionFrameSegment {
	value: number;
	tween: Tween;
	composition: Composition;
}
