import { SetStateAction, useCallback, useState } from "react";

import { useIsMountedRef } from "./useIsMountedRef";

/**
 * Works exactly like useState, but will ignore updates if component is not mounted anymore.
 *
 * Useful where setState is part of any sort of async callbacks, where we want to avoid react warnings of setting state on
 * unmounted components.
 */
export function useMountSafeState<S>(initial: S | (() => S)) {
  const isMountedRef = useIsMountedRef();
  const [value, setValue] = useState(initial);

  const setIfMounted = useCallback((newValue: SetStateAction<S>) => {
    if (!isMountedRef.current) return;

    setValue(newValue);
  }, []);

  return [value, setIfMounted] as const;
}
