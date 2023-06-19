export type TIteratorReturnValue<T> = T extends Iterable<infer U> ? U : never;
