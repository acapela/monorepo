import { useState } from "react";

import { useWindowEvent } from "~shared/domEvents";

export function useHashChangeEffect(callback: (hash: string | null) => void) {
  useWindowEvent("hashchange", () => {
    const hashStringOnly = location.hash.replace(/^#/, "");

    if (!hashStringOnly.length) {
      callback(null);
      return;
    }
    callback(hashStringOnly);
  });
}

export function getCurrentHashName() {
  if (typeof location === "undefined") return null;

  const hashStringOnly = location.hash.replace(/^#/, "");

  if (!hashStringOnly.length) {
    return null;
  }

  return hashStringOnly;
}

export function getIsHashActive(hash: string) {
  return getCurrentHashName() === hash;
}

export function useIsHashActive(hash: string) {
  const [isActive, setIsActive] = useState(() => getIsHashActive(hash));

  useHashChangeEffect((newHash) => {
    setIsActive(newHash === hash);
  });

  return isActive;
}
