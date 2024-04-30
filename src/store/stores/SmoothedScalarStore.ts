import { Store } from '../Store.js';

export class SmoothedScalarStore extends Store<number> {
	private targetValue = 0;
	private readonly options = {
		maxSpeedPerSecond: 1000,
		minSpeedPerSecond: 0.01,
		smoothingFactor: 0.1,
	};

	private readonly maxSpeedPerMs: number;
	private readonly minSpeedPerMs: number;
	private readonly smoothingPerSecond: number;

	private rafHandle: ReturnType<typeof requestAnimationFrame> | undefined;
	private prevT = performance.now();

	constructor(options: Partial<SmoothedScalarStore['options']> = {}) {
		super(0);

		Object.assign(this.options, options);
		this.maxSpeedPerMs = this.options.maxSpeedPerSecond / 1000;
		this.minSpeedPerMs = this.options.minSpeedPerSecond / 1000;
		this.smoothingPerSecond = this.options.smoothingFactor * 1000;
	}

	public override set(value: number) {
		this.targetValue = value;

		if (this.rafHandle) cancelAnimationFrame(this.rafHandle);
		this.rafHandle = requestAnimationFrame(this.raf);
	}

	private readonly raf = (t: number) => {
		this.rafImpl(t);
	};

	private rafImpl(t: number) {
		const value = this.next(t);

		if (!value) return;

		super.set(value);

		this.rafHandle = requestAnimationFrame(this.raf);
	}

	private next(t: number) {
		const smoothedValue = this.get();
		const { targetValue } = this;

		if (!Store.neq(smoothedValue, targetValue)) return;

		const delta = targetValue - smoothedValue;
		const remainingDistance = Math.abs(delta);
		const slower =
			1 -
			Math.max(this.smoothingPerSecond - remainingDistance, 0) /
				this.smoothingPerSecond;
		const sign = Math.sign(delta);
		const deltaMs = t - this.prevT;
		this.prevT = t;
		const increment =
			sign *
			Math.max(this.maxSpeedPerMs * slower, this.minSpeedPerMs) *
			deltaMs;

		return sign > 0
			? Math.min(smoothedValue + increment, targetValue)
			: Math.max(smoothedValue + increment, targetValue);
	}
}
