export type Maybe<T> = T | null | undefined;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type IsUnion<T, U extends T = T> = (T extends any ? (U extends T ? false : true) : never) extends false
  ? false
  : true;
