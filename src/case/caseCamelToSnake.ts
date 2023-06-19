export const caseCamelToSnake = (input: string) =>
	input.replace(/([A-Z])/g, (_, match) => `_${String(match).toLowerCase()}`);
