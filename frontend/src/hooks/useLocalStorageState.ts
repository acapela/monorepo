import { isEqual } from "lodash";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

export function useLocalStorageState<S>({
  key,
  initialValue,
}: {
  key: string;
  initialValue: S;
}): [S, Dispatch<SetStateAction<S>>, () => void] {
  const [value, setValue] = useState<S>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const clear = useCallback(() => localStorage.removeItem(key), [key]);

  useEffect(() => {
    if (isEqual(value, initialValue)) {
      clear();
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key, clear, initialValue]);

  return [value, setValue, clear];
}
