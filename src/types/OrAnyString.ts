export type OrAnyString<T extends string> = T | (string & Record<never, never>);
