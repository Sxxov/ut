export type IteratorReturnValue<T> = T extends Iterable<infer U> ? U : never;
