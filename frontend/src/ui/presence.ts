import { usePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { createTimeout } from "@aca/shared/time";

export function useUnmountPresence(time: number) {
  const [isMounted, setIsMounted] = useState(false);

  const [isNotRemoved, safeToRemove] = usePresence();

  useEffect(() => {
    /**
     * We intentionally set mounted to true with small timeout to allow animation of initial mounting.
     */
    setTimeout(() => setIsMounted(true), 1);
  }, []);

  useEffect(() => {
    if (isNotRemoved) return;

    return createTimeout(() => safeToRemove?.(), time);
  }, [isNotRemoved, safeToRemove, time]);

  return isMounted && isNotRemoved;
}
