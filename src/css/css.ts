export type Css = string | number;

/**
 * Converts a number or a number string to a CSS value.
 *
 * **For strings starting with `--`**: They are wrapped with `var()`
 * automatically.
 *
 * **For values that are neither a number or a number string**: They are
 * returned as-is.
 *
 * @param value A number or a string representing a number.
 * @param unit The unit to append to the number. Defaults to `px`.
 * @returns A CSS value.
 */
export const css = (value: Css, unit = 'px') => {
	/**
	 * If the value is a number or a number string (not NaN when passed through
	 * the Number ctor), append the unit and return it.
	 */
	if (typeof value === 'number' || !Number.isNaN(Number(value)))
		return `${value}${unit}`;

	/**
	 * If the value is a string starting with `--`, wrap it with `var()` and
	 * return it.
	 */
	if (value.startsWith('--')) return `var(${value})`;

	return value;
};
