import { usePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

import { createTimeout } from "~shared/time";

export function useUnmountPresence(time: number) {
  const [isMounted, setIsMounted] = useState(false);

  const [isNotRemoved, safeToRemove] = usePresence();

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isNotRemoved) return;

    return createTimeout(() => safeToRemove?.(), time);
  }, [isNotRemoved, safeToRemove, time]);

  return isMounted && isNotRemoved;
}
