import { debounce, throttle } from "lodash";

import { useConst } from "./useConst";
import { useMountSafeState } from "./useMountSafeState";

export function useDebouncedState<S>(initial: S | (() => S), time: number) {
  const [value, setValue] = useMountSafeState(initial);

  const setThrottled = useConst(() => debounce(setValue, time));

  return [value, setThrottled] as const;
}

export function useThrottledState<S>(initial: S | (() => S), time: number) {
  const [value, setValue] = useMountSafeState(initial);

  const setThrottled = useConst(() => throttle(setValue, time, { leading: true }));

  return [value, setThrottled] as const;
}
