export type ArrayElement<T> = T extends (infer U)[] ? ArrayElement<U> : T;
