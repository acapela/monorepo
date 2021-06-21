import { DependencyList, EffectCallback, useEffect } from "react";
import { useEqualRef } from "./useEqualRef";

/**
 * It is the same as useEffect, except it will compare deps by equality, not by reference.
 */
export function useEqualEffect(effect: EffectCallback, deps?: DependencyList) {
  const depsEqualRef = useEqualRef(deps);
  useEffect(effect, depsEqualRef);
}
