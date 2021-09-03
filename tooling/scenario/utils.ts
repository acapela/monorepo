import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line no-console
export const clearConsole = console.clear;

export function useCallOnFirstRender(callback: () => void) {
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    isFirstRenderRef.current = true;
  }, []);

  if (isFirstRenderRef.current) {
    callback();
  }
}

export function useForceUpdate() {
  const [, setState] = useState(0);

  function update() {
    setState((state) => state + 1);
  }

  return update;
}
