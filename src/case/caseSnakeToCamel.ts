export const caseSnakeToCamel = (input: string) =>
	input.replace(/(_\w)/g, (_, match) => String(match[1]).toUpperCase());
