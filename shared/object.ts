import { isPlainObject, mergeWith, pick } from "lodash";
import { DeepPartial } from "utility-types";

import { isPlainObjectEqual } from "@aca/shared/isPlainObjectEqual";

import { generateId } from "./id";

export type AnyObject = Record<keyof unknown, unknown>;

export function objectMap<O extends AnyObject, NV>(
  input: O,
  mapper: (value: O[keyof O], key: keyof O) => NV
): Record<keyof O, NV> {
  const mappedObject = {} as Record<keyof O, NV>;
  typedKeys(input).forEach((key) => {
    const oldValue = input[key];
    const newValue = mapper(oldValue, key);

    mappedObject[key] = newValue;
  });

  return mappedObject;
}

/**
 * It is the same as Object.keys, except it'' return typed array. Use with caution as your object might have more
 * properties than its type says.
 */
export function typedKeys<O>(input: O): Array<keyof O> {
  return Object.keys(input) as Array<keyof O>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objectKeys = new Map<any, string>();

/**
 * This function will get different key for each unique object you provide it, but the same key for the same object every
 * time.
 *
 * This is useful if you want to eg. remount some react component basing on object where you don't have access to any
 * string key.
 *
 * Use case example - you want to remount page component in _app with animation. To do it, you'd need key on page wrapper.
 *
 * Key has to be different for each page component, so you could use key={getObjectKey(Component)}
 */
export function getObjectKey(input: unknown) {
  const existingKey = objectKeys.get(input);

  if (existingKey) return existingKey;

  const newKey = generateId();

  objectKeys.set(input, newKey);

  return newKey;
}

type NonUndefined<T> = T extends undefined ? never : T;

type WithoutUndefined<T> = {
  [P in keyof T]-?: NonUndefined<T[P]>;
};

export function removeUndefinedFromObject<T>(input: T): WithoutUndefined<T> {
  const clone = { ...input };

  typedKeys(clone).forEach((key) => {
    if (clone[key] === undefined) {
      delete clone[key];
    }
  });

  return clone as WithoutUndefined<T>;
}

type Keyable = string | number | symbol;

export function swapPlainObjectKeysWithValues<K extends Keyable, V extends Keyable>(input: Record<K, V>): Record<V, K> {
  const result: Record<V, K> = {} as Record<V, K>;

  for (const key in input) {
    const value = input[key];
    result[value] = key;
  }

  return result;
}

export function isEqualForPick<O1 extends object, O2 extends object, K extends keyof O1>(
  obj1: O1,
  obj2: O2,
  fields: K[]
) {
  return isPlainObjectEqual(pick(obj1, fields), pick(obj2, fields));
}

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
type Cast<X, Y> = X extends Y ? X : Y;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FromEntries<T> = T extends [infer Key, any][]
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { [K in Cast<Key, string>]: Extract<ArrayElement<T>, [K, any]>[1] }
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { [key in string]: any };

export type FromEntriesWithReadOnly<T> = FromEntries<DeepWriteable<T>>;

export function deepMerge<T>(source: T, overwrites: DeepPartial<T>) {
  return mergeWith(overwrites, source, (value: unknown, srcValue: unknown) => {
    if (isPlainObject(srcValue) || isPlainObject(value)) {
      return;
    }

    return value;
  }) as T;
}
