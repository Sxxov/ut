import type { TCss } from './TCss.js';

export const css = (value: TCss, unit = 'px') => {
	if (typeof value === 'number' || !Number.isNaN(Number(value)))
		return `${value}${unit}`;

	if (value.startsWith('--')) return `var(${value})`;

	return value;
};
