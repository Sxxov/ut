/**
 * A simple function that wraps throwing an error. Useful for when you want to
 * throw an error in an expression, such as to assert that a specific fallback
 * is unreachable.
 *
 * @example
 * 	const value = nullable?.value ?? raise(new Error('Value is null!'));
 */
export const raise = (error: Error) => {
	throw error;
};
