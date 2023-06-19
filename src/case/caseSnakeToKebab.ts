export const caseSnakeToKebab = (v: string) =>
	v.replace(/(_\w)/g, (_, match) => `-${String(match[1])}`);
