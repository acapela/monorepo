type ExistingKeys<T> = {
  [Key in keyof T]-?: T[Key] extends never ? never : Key;
}[keyof T];

type ExcludeNever<T> = Pick<T, ExistingKeys<T>>;

type PickByPartialMatch<T, V> = ExcludeNever<{
  [key in keyof T]: V extends T[key] ? T[key] : never;
}>;

type PickOptional<T> = PickByPartialMatch<T, null | void>;

/**
 * Create type when optional (null or ?) values must be explicitly filled,
 *
 * eg. PartialWithExplicitOptionals<{ foo?: string, bar: string }> = { foo: string | undefined, bar: string }
 */
export type PartialWithExplicitOptionals<T> = Required<PickOptional<T>> & Partial<T>;
