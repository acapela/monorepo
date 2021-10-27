import { usePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { createTimeout } from "~shared/time";

export function useUnmountPresence(time: number) {
  const [isMounted, setIsMounted] = useState(false);

  const [isNotRemoved, safeToRemove] = usePresence();

  useEffect(() => {
    return createTimeout(() => {
      setIsMounted(true);
    }, 10);
  }, []);

  useEffect(() => {
    if (isNotRemoved) return;

    return createTimeout(() => safeToRemove?.(), time);
  }, [isNotRemoved, safeToRemove, time]);

  return isMounted && isNotRemoved;
}
