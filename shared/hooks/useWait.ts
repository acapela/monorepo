import { useEffect, useState } from "react";

import { createTimeout } from "@aca/shared/time";

export function useWait(time: number, isEnabled = true) {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      setIsCompleted(false);
      return;
    }

    if (isCompleted) return;

    return createTimeout(() => {
      setIsCompleted(true);
    }, time);
  }, [time, isEnabled]);

  return isCompleted;
}
