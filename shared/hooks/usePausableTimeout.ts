import { useEffect, useRef } from "react";

import { createTimeout } from "@aca/shared/time";

import { useMethod } from "./useMethod";

export function usePausableTimeout(time: number, isPlaying: boolean, callback: () => void) {
  const timeRemainingRef = useRef(time);
  const callbackRef = useMethod(callback);

  useEffect(() => {
    if (!isPlaying) return;

    const timeRemaining = timeRemainingRef.current;

    if (timeRemaining <= 0) return;

    const playStartTime = new Date();

    const cancelTimeout = createTimeout(() => {
      timeRemainingRef.current = 0;
      callbackRef();
    }, timeRemaining);

    return () => {
      cancelTimeout();

      const cancelTime = new Date();

      const playDuration = cancelTime.getTime() - playStartTime.getTime();
      timeRemainingRef.current -= playDuration;
    };
  }, [isPlaying]);
}
