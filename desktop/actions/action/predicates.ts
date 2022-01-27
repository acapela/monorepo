import { assert } from "@aca/shared/assert";

type PredicatesMap = Record<string, (input: unknown) => input is unknown>;

type PredicateFunctionType<T> = T extends (item: unknown) => item is infer U ? U : never;

type PredicateFunctionsTypeMap<T> = {
  [key in keyof T]: PredicateFunctionType<T[key]>;
};

/**
 * Creates utility for predicting and narrowing down type of input.
 *
 * It is useful for action context, where we don't know what type is target, but we want to have it type safe depending on context.
 *
 * Example:
 *
 * interface Foo {
 *   id: "foo"
 * }
 *
 * const p = createPredicates({
 *   foo(input: unknown): input is Foo { // <- return type must be predicate!
 *     return input.id === "foo"
 *   },
 *   () => ({id: "foo"}) // <- anything can be here (type is unknown)
 * });
 *
 * then
 *
 * p.getTarget("foo") // <- returns Foo type or null
 */

export function createPredicates<P extends PredicatesMap>(predicates: P, targets: () => unknown[]) {
  type TargetName = keyof P;
  type TargetsMap = PredicateFunctionsTypeMap<P>;

  function getFirstTarget() {
    return targets()[0];
  }

  function hasTarget<N extends TargetName>(name: N): boolean {
    return predicates[name](getFirstTarget());
  }

  function getTarget<N extends TargetName>(name: N): TargetsMap[N] | null {
    if (hasTarget(name)) {
      return getFirstTarget() as TargetsMap[N];
    }

    return null;
  }

  function assertTarget<N extends TargetName>(name: N): TargetsMap[N] {
    const target = getTarget(name);

    assert(target, "nope");

    return target;
  }

  function getTargets<N extends TargetName>(name: N): TargetsMap[N][] {
    return targets().filter((target) => predicates[name](target)) as TargetsMap[N][];
  }

  function hasTargets<N extends TargetName>(name: N) {
    return getTargets(name).length > 0;
  }

  return {
    hasTarget,
    getTarget,
    getTargets,
    hasTargets,
    assertTarget,
  };
}
