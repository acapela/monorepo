/* eslint-disable @typescript-eslint/no-explicit-any */
export type Maybe<T> = T | null | undefined;

// Checks if type is composed of multiple values eg 'foo' | 'bar'
export type IsUnion<T, U extends T = T> = (T extends any ? (U extends T ? false : true) : never) extends false
  ? false
  : true;

export type EmptyObject = Record<string, never>;
export type VoidableIfEmpty<V> = EmptyObject extends V ? V | void : V;

type Replacement<M extends [any, any], T> = M extends any ? ([T] extends [M[0]] ? M[1] : never) : never;

export type DeepReplace<T, M extends [any, any]> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]: T[P] extends M[0] ? Replacement<M, T[P]> : T[P] extends object ? DeepReplace<T[P], M> : T[P];
};

/**
 * Will create 'runtime-safe' type of value that is parsed from/to json.
 *
 * It will modify all dates to strings
 */
export type JsonValue<T> = DeepReplace<
  T,
  [
    // prettier-ignore
    Date | undefined | null, // <-- Convert all dates
    string | null // <-- into strings or nulls. (Invalid dates are converted to null on JSON.stringify eg JSON.stringify(new Date(NaN)) ->> "null")
  ]
>;

export type PromiseResult<T> = T extends PromiseLike<infer U> ? U : T;

export type AsyncReturnType<T> = T extends (...args: any[]) => PromiseLike<infer U> ? U : T;

export type Cleanup = () => void;
export type MaybeCleanup = Cleanup | void;

export type VoidableArgument<T> = T extends void ? [] : [T];
