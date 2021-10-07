import { isEqual } from "lodash";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorageState<S>({
  key,
  initialValue,
}: {
  key: string;
  initialValue: S;
}): [S, Dispatch<SetStateAction<S>>] {
  const [value, setValue] = useState<S>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    if (isEqual(value, initialValue)) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key, initialValue]);

  return [value, setValue];
}
