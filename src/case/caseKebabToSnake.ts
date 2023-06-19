export const caseKebabToSnake = (v: string) =>
	v.replace(/(-\w)/g, (_, match) => `_${String(match[1])}`);
