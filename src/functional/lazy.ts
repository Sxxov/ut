export const lazy = <T>(factory: () => T) => {
	let value: T | undefined;
	return () => (value ??= factory());
};
