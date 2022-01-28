import { assert } from "@aca/shared/assert";

/**
 * With action objects - we don't know what is action context target (eg. what is hovered, what page is active, etc).
 *
 * There might be multiple targets at once (eg. active page is some list of notifications, but we also have hover on some specific notification).
 *
 * Thus target might be an array of items of various types.
 *
 * Those are helpers allowing to work with this context in type safe way.
 */

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

export function createPredicates<P extends PredicatesMap>(predicates: P, targetsGetter: () => unknown[]) {
  type TargetName = keyof P;
  type TargetsMap = PredicateFunctionsTypeMap<P>;

  function isMatching<N extends TargetName>(name: N, item: unknown): item is TargetsMap[N] {
    return predicates[name](item);
  }

  function getTarget<N extends TargetName>(name: N, canBeSecondary = false): TargetsMap[N] | null {
    const targets = targetsGetter();

    if (!canBeSecondary) {
      const [primaryTarget] = targets;

      if (isMatching(name, primaryTarget)) {
        return primaryTarget;
      }

      return null;
    }

    return (
      targets.find((target): target is TargetsMap[N] => {
        return isMatching(name, target);
      }) ?? null
    );
  }

  function hasTarget<N extends TargetName>(name: N, canBeSecondary = false): boolean {
    return !!getTarget(name, canBeSecondary);
  }

  function assertTarget<N extends TargetName>(name: N, canBeSecondary = false): TargetsMap[N] {
    const target = getTarget(name, canBeSecondary);

    assert(target, `Asserted target is not present for name ${name}`);

    return target;
  }

  function getTargets<N extends TargetName>(name: N): TargetsMap[N][] {
    return targetsGetter().filter((target) => isMatching(name, target)) as TargetsMap[N][];
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
