const targetSymbol = Symbol("target");

type AnyMap = Map<unknown, unknown>;
export function createDeepMap<V>(factory: () => V) {
  const root = new Map<unknown, unknown>();
  function get(path: unknown[]) {
    let currentTarget = root;

    for (const part of path) {
      if (currentTarget.has(part)) {
        currentTarget = currentTarget.get(part) as AnyMap;
        continue;
      }

      const nestedMap: AnyMap = new Map();

      currentTarget.set(part, nestedMap);

      currentTarget = nestedMap;
    }

    if (currentTarget.has(targetSymbol)) {
      return currentTarget.get(targetSymbol) as V;
    }

    const newResult = factory();

    currentTarget.set(targetSymbol, newResult);

    return newResult;
  }

  return get;
}
