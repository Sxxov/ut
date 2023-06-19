export const caseCamelToPascal = (v: string) =>
	`${v[0]?.toUpperCase() ?? ''}${v.slice(1)}`;
