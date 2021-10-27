import { EqualValueReuser, createEqualValueReuser } from "./createEqualReuser";

const targetSymbol = Symbol("target");
const equalReuserSymbol = Symbol("equalReuserSymbol");

interface Options {
  checkEquality?: boolean;
}

type AnyMap = Map<unknown, unknown>;
export function createDeepMap<V>({ checkEquality = false }: Options = {}) {
  const root = new Map<unknown, unknown>();
  const rootReuser = createEqualValueReuser();
  root.set(equalReuserSymbol, rootReuser);
  function get(path: unknown[], factory: () => V) {
    let currentTarget = root;
    const currentReuser = currentTarget.get(equalReuserSymbol) as EqualValueReuser;

    for (let part of path) {
      if (checkEquality) {
        part = currentReuser(part);
      }

      if (currentTarget.has(part)) {
        currentTarget = currentTarget.get(part) as AnyMap;
        continue;
      }

      const nestedMap: AnyMap = new Map();

      nestedMap.set(equalReuserSymbol, createEqualValueReuser());

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
