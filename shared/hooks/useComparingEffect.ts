import { useEffect, useRef } from "react";

type EffectCleanup = () => void;

type CompareEffect<T> = (valueNow: T, valueBefore: T) => void | EffectCleanup;

export function useComparingEffect<D>(effect: CompareEffect<D>, dependency: D) {
  const previousValueRef = useRef<D>(dependency);
  const isFirstRunRef = useRef(true);
  useEffect(() => {
    if (isFirstRunRef.current) {
      return () => {
        isFirstRunRef.current = false;
        previousValueRef.current = dependency;
      };
    }

    const cleanup = effect(dependency, previousValueRef.current);

    return () => {
      cleanup && cleanup();
      previousValueRef.current = dependency;
    };
  }, [dependency]);
}
