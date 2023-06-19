export const caseKebabToCamel = (v: string) =>
	v.replace(/(-\w)/g, (_, match) => String(match[1]).toUpperCase());
