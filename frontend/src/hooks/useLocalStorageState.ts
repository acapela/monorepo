import { useCallback, useState } from "react";

import { useDependencyChangeEffect } from "~frontend/../../shared/hooks/useChangeEffect";
import { createTimeout } from "~frontend/../../shared/time";

interface Input<S> {
  key?: string;
  initialValue: S;
  persistDebounce?: number;
}

function readLocalStorageJSON<S>(key: string) {
  const storedValue = localStorage.getItem(key);

  if (storedValue === null) {
    return null;
  }

  return JSON.parse(storedValue) as S;
}

function setLocalStorageJSON<S>(key: string, value: S) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function usePersistedState<S>({ key, initialValue, persistDebounce }: Input<S>) {
  function getInitialValue() {
    if (typeof localStorage === "undefined" || !key) {
      return initialValue;
    }

    return readLocalStorageJSON<S>(key) ?? initialValue;
  }

  const [value, setValue] = useState<S>(getInitialValue);

  const clear = useCallback(() => {
    if (!key) return;

    localStorage.removeItem(key);
  }, [key]);

  useDependencyChangeEffect(() => {
    function persist() {
      if (!key) return;
      setLocalStorageJSON(key, value);
    }

    if (!persistDebounce) {
      persist();
      return;
    }

    return createTimeout(persist, persistDebounce);
  }, [value, key, clear, initialValue, persistDebounce]);

  return [value, setValue, clear] as const;
}
