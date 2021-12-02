import { decode, encode } from "js-base64";
import { useCallback, useMemo } from "react";
import { useSearchParam } from "react-use";

function setUrlParam(key: string, value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, "", url.toString());
}

export function useMutableSearchParam(key: string) {
  const value = useSearchParam(key);

  const set = useCallback((value: string) => {
    setUrlParam(key, value);
  }, []);

  return [value, set] as const;
}

export function useBase64SearchParam<T>(key: string, initialValue: () => T) {
  const [rawValue, rawSet] = useMutableSearchParam(key);

  const realValue = useMemo(() => (rawValue ? (JSON.parse(decode(rawValue)) as T) : null), [rawValue]);

  const set = useCallback(
    (value: T) => {
      const base64 = encode(JSON.stringify(value));

      rawSet(base64);
    },
    [rawSet]
  );

  return [realValue ?? initialValue(), set] as const;
}
