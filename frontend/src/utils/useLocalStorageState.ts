import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorageState<S>({
  key,
  getInitialValue,
  checkShouldStore,
}: {
  key: string;
  getInitialValue: () => S;
  checkShouldStore: (value: S) => boolean;
}): [S, Dispatch<SetStateAction<S>>] {
  const [value, setValue] = useState<S>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : getInitialValue();
  });

  useEffect(() => {
    if (checkShouldStore(value)) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }, [value, checkShouldStore, key]);

  return [value, setValue];
}
