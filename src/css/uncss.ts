// eslint-disable-next-line complexity
export const uncss = (cssString: string, target?: HTMLElement) => {
	const value = cssString.trim();
	let curr = NaN;

	if (!Number.isNaN((curr = Number(value)))) return curr;

	if (!Number.isNaN((curr = Number(value.replace(/px$/, ''))))) return curr;

	if (!Number.isNaN((curr = Number(value.replace(/%$/, '')))))
		return (
			((target
				? Math.min(target.clientWidth, target.clientHeight)
				: Math.min(
						globalThis.innerWidth ?? NaN,
						globalThis.innerHeight ?? NaN,
				  )) /
				100) *
			curr
		);

	if (!Number.isNaN((curr = Number(value.replace(/vh$/, '')))))
		return ((globalThis.innerHeight ?? NaN) / 100) * curr;

	if (!Number.isNaN((curr = Number(value.replace(/vw$/, '')))))
		return ((globalThis.innerWidth ?? NaN) / 100) * curr;

	if (!Number.isNaN((curr = Number(value.replace(/vmax$/, '')))))
		return (
			(Math.max(
				globalThis.innerWidth ?? NaN,
				globalThis.innerHeight ?? NaN,
			) /
				100) *
			curr
		);

	if (!Number.isNaN((curr = Number(value.replace(/vmax$/, '')))))
		return (
			(Math.min(
				globalThis.innerWidth ?? NaN,
				globalThis.innerHeight ?? NaN,
			) /
				100) *
			curr
		);

	if (value.startsWith('var(--'))
		return target ?? typeof document !== 'undefined'
			? Number(
					globalThis
						.getComputedStyle?.(target ?? document.documentElement)
						.getPropertyValue(
							value.replace(/^var\(/, '').replace(/\)$/, ''),
						)
						.trim() ?? NaN,
			  )
			: NaN;

	const { style } = (target ??
		(typeof document === 'undefined'
			? { style: {} }
			: document.documentElement)) as { style: { x?: string } };

	style.x = value;
	curr =
		target ?? typeof document !== 'undefined'
			? Number.parseFloat(
					(
						globalThis.getComputedStyle?.(
							target ?? document.documentElement,
						) as unknown as { x: string }
					).x,
			  )
			: NaN;
	delete style.x;

	return curr;
};
