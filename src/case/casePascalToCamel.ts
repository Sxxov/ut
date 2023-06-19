export const casePascalToCamel = (v: string) =>
	`${v[0]?.toLowerCase() ?? ''}${v.slice(1)}`;
