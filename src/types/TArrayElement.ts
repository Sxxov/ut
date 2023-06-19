export type TArrayElement<T> = T extends (infer U)[] ? TArrayElement<U> : T;
