import { isEqual } from "lodash";

export function createEqualSet<T>() {
  const rawSet = new Set<T>();

  function getExisting(value: T) {
    if (rawSet.has(value)) return value;

    for (const item of rawSet) {
      if (isEqual(item, value)) {
        return item;
      }
    }

    return null;
  }

  function has(value: T) {
    return getExisting(value) !== null;
  }

  function add(value: T) {
    if (has(value)) return false;

    rawSet.add(value);
    return true;
  }

  function remove(value: T) {
    const existing = getExisting(value);

    if (!existing) {
      return false;
    }

    return rawSet.delete(existing);
  }

  function getAll() {
    return Array.from(rawSet);
  }

  return {
    has,
    add,
    remove,
    getAll,
    getExisting,
  };
}
