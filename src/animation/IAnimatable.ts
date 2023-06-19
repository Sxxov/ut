import { type IReadableStore } from '../store/IReadableStore.js';

export interface IAnimatable {
	readonly isPlaying: IReadableStore<boolean>;
	readonly duration: number;
	readonly length: number;
	play(direction: number): Promise<void>;
	pause(): void;
	stop(): void;
	seekToProgress(progress: number): void;
	seekToTime(time: number): void;
	seekToValue(value: number): void;
	destroy(): void;
}