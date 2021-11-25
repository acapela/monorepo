import { useRef } from "react";
import { useUnmount } from "react-use";

export function useIsMountedRef() {
  const isMountedRef = useRef(true);

  useUnmount(() => {
    isMountedRef.current = false;
  });

  return isMountedRef;
}
