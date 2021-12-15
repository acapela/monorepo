import { isPrimitive } from "utility-types";

import { EqualValueReuser, reuseValue } from "./createEqualReuser";

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

let deepMapResued = 0;
let deepMapNotReused = 0;

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
  root.set(equalReuserSymbol, reuseValue);

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

      const nestedMap = new Map();

      nestedMap.set(equalReuserSymbol, reuseValue);

      currentTarget.set(part, nestedMap);

      currentTarget = nestedMap;
    }

    return currentTarget;
  }

  function get(path: unknown[], factory: () => V) {
    const targetMap = getFinalTargetMap(path);

    if (targetMap.has(targetSymbol)) {
      deepMapResued++;
      return targetMap.get(targetSymbol) as V;
    }

    deepMapNotReused++;

    const newResult = factory();

    targetMap.set(targetSymbol, newResult);

    return newResult;
  }

  return { get };
}

let i = 0;

function createMaybeWeakMap<K, V>() {
  const weak = new WeakMap<K & object, V>();
  const primitive = new Map<K, V>();

  function get(key: K) {
    if (isPrimitive(key)) {
      return primitive.get(key);
    }
    return weak.get(key as K & object);
  }

  function set(key: K, value: V) {
    if (isPrimitive(key)) {
      i++;
      return primitive.set(key, value);
    }
    return weak.set(key as K & object, value);
  }

  function has(key: K) {
    if (isPrimitive(key)) {
      return primitive.has(key);
    }
    return weak.has(key as K & object);
  }

  return { get, set, has };
}

setInterval(() => {
  console.log("i", { deepMapNotReused, deepMapResued });
}, 1000);
