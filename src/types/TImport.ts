export type TImport<
	Default = unknown,
	Named extends Record<string, unknown> = Record<string, unknown>,
> = { default: Default } & Named;
