import { useRef } from "react";

export function useGetTimeSinceMounted() {
  const mountTimeRef = useRef(0);

  if (mountTimeRef.current === 0) {
    mountTimeRef.current = new Date().getTime();
  }

  return function getTimeSinceMounted() {
    const nowTime = new Date().getTime();

    return nowTime - mountTimeRef.current;
  };
}
