const endOfArgumentsObject = {};

type NestedWeakMap<R> = WeakMap<object, NestedWeakMap<R> | R>;

export function weakMemoize<A extends object[], R>(callback: (...args: A) => R) {
  const root: NestedWeakMap<R> = new WeakMap();
  return function getMemoized(...args: A): R {
    let target = root;
    for (const nextArg of args) {
      let nextTarget = target.get(nextArg) as NestedWeakMap<R> | undefined;

      if (!nextTarget) {
        nextTarget = new WeakMap();
        target.set(nextArg, nextTarget);
      }

      target = nextTarget;
    }

    const result = target.get(endOfArgumentsObject) as R | undefined;

    if (result !== undefined) {
      return result;
    }

    const newResult = callback(...args);

    target.set(endOfArgumentsObject, newResult);

    return newResult;
  };
}
