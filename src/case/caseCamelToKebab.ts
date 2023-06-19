export const caseCamelToKebab = (v: string) =>
	v.replace(/([A-Z])/g, (_, match) => `-${String(match).toLowerCase()}`);
