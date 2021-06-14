/* eslint-disable @typescript-eslint/no-explicit-any */
export type Maybe<T> = T | null | undefined;

// Checks if type is composed of multiple values eg 'foo' | 'bar'
export type IsUnion<T, U extends T = T> = (T extends any ? (U extends T ? false : true) : never) extends false
  ? false
  : true;

export type EmptyObject = Record<string, never>;
export type VoidableIfEmpty<V> = EmptyObject extends V ? V | void : V;
