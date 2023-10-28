import type { TimeAt } from './TimeAt.js';
import type { TimelineAtAlign } from './TimelineAtAlign.js';

export type TimelineAt = (TimeAt & Partial<TimelineAtAlign>) | undefined;
