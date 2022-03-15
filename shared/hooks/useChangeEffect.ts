import { DependencyList, EffectCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Works the same way as normal useEffect, except it ignores the first call of the effect.
 *
 * It means it can be used to track changes of dependencies after initial render.
 */
export function useDependencyChangeEffect(callback: EffectCallback, deps: DependencyList) {
  const isFirstEffectRef = useRef(true);
  useEffect(() => {
    if (isFirstEffectRef.current) {
      isFirstEffectRef.current = false;
      return;
    }

    return callback();
  }, deps);
}

export function useDependencyChangeLayoutEffect(callback: EffectCallback, deps: DependencyList) {
  const isFirstEffectRef = useRef(true);
  useLayoutEffect(() => {
    if (isFirstEffectRef.current) {
      isFirstEffectRef.current = false;
      return;
    }

    return callback();
  }, deps);
}
