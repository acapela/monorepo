import { EqualValueReuser, createEqualValueReuser } from "./createEqualReuser";
import { devAssignWindowVariable } from "./dev";

const targetSymbol = Symbol("target");
const equalReuserSymbol = Symbol("equalReuserSymbol");
const undefinedSymbol = Symbol("undefined");

interface Options {
  /**
   * Allows getting the same value for equal keys. eg.
   *
   * deepMap.get([{foo: 2}])
   * deepMap.get([{foo: 2}])
   *
   * Both would return the same ref value, even tho those are identical, but different ref objects as input
   */
  checkEquality?: boolean;
}

type AnyMap = Map<unknown, unknown>;

/**
 * Creates map that can hold value arbitrarily deep.
 *
 * usage:
 *
 * const foo = createDeepMap<number>();
 *
 * foo.get([a,b,c,d,e,f], () => {
 *   // will be called only if value does not exist yet
 *   return 42;
 * }); // 42
 */
export function createDeepMap<V>({ checkEquality = false }: Options = {}) {
  const root = new Map<unknown, unknown>();
  const rootReuser = createEqualValueReuser();
  root.set(equalReuserSymbol, rootReuser);

  function getFinalTargetMap(path: unknown[]) {
    let currentTarget = root;
    const currentReuser = currentTarget.get(equalReuserSymbol) as EqualValueReuser;

    for (let part of path) {
      if (part === undefined) part = undefinedSymbol;
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

    return currentTarget;
  }

  function get(path: unknown[], factory: () => V) {
    const targetMap = getFinalTargetMap(path);

    if (targetMap.has(targetSymbol)) {
      return targetMap.get(targetSymbol) as V;
    }

    const newResult = factory();

    targetMap.set(targetSymbol, newResult);

    return newResult;
  }

  return { get };
}

devAssignWindowVariable("f", createDeepMap);
