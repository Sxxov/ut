export type OrAnyNumber<T extends number> = T | (number & Record<never, never>);
