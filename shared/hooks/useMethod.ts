import { useCallback, useRef, useLayoutEffect } from "react";

type Callback<Args extends unknown[], Result> = (...args: Args) => Result;

/**
 * Create callback that keeps the same reference during entire lifecycle of the component while having access to fresh
 * variables values on every call
 *
 * Note: It can only be used inside callbacks like events / server responses / effects etc.
 *
 * If you want to call it during the render - you probably don't need to memoize the function or using `useCallbacl` might be more suitable
 */
export function useMethod<Args extends unknown[], Result>(callback: Callback<Args, Result>) {
  const lastRenderCallbackRef = useRef<Callback<Args, Result>>(callback);

  const methodLikeCallback = useCallback((...args: Args) => {
    // perform call on version of the callback from last commited render
    return lastRenderCallbackRef.current(...args);
  }, []);

  /**
   * In concurrent mode - render method can be called multiple times without commiting the update
   * also - even after rendering happened - some update might get aborted and actually never be commited.
   *
   * For that reason - it's important to actually update the function only after the render is commited.
   *
   * If we do it during the render - such case is possible
   * 1. new render starts
   *      - optionally render function might actually get called multiple times (side note - in react strict mode - react actually intentionally call every render function twice to break things quickly in dev mode if they're implemented incorrectly)
   * 2. during every render call function reference is replaced
   * 3. let's say render is not instantly commited (or gets aborted)
   *      - now we have callback ref that comes from uncommited, dead render
   * 4. now function callback get's called before next render attempt due to some event/server response etc
   * 5. as it's already replaced - it's calling callback that is not commited to any render and might work incorrectly / cause really nasty bugs or actually crash the app
   *
   * When doing assignment inside layout effect
   * - even if render will be called multiple times without commiting - still previous commited callback ref is kept
   * - it means that even if some callbacks are called - they'll use proper, last working callback
   */
  // TODO: During first render - we assing callback ref instantly which could break in concurrent mode due to above reasons.
  useLayoutEffect(() => {
    // render is commited - it's safe to update the callback
    lastRenderCallbackRef.current = callback;
  });

  return methodLikeCallback;
}
