import { isPlainObjectEqual } from "./isPlainObjectEqual";

/**
 * Useful if we want to re-use ref to equal value.
 *
 * eg.
 *
 * const reuse = createEqualValueReuser()
 * const a = reuse({foo: 2});
 * const b = reuse({foo: 2});
 *
 * a === b // true
 *
 * const a = {foo: 2}
 * const b = {foo: 2}
 *
 * a === b // ! false
 *
 */
export function createEqualValueReuser() {
  const values = new Set<unknown>();

  setInterval(() => {
    console.log(values.size, "size");
  }, 1000);

  function getOrReuse<T>(value: T): T {
    for (const existingValue of values) {
      if (isPlainObjectEqual(existingValue, value)) {
        return existingValue as T;
      }
    }

    values.add(value);

    return value;
  }

  return getOrReuse;
}

export type EqualValueReuser = ReturnType<typeof createEqualValueReuser>;

export const reuseValue = createEqualValueReuser();
