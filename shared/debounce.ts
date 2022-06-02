/**
 * Similar to regular debounce, expect calling debounced function returns cancel function.
 *
 * This cancel function allows cancelling this one specific call if it is still pending.
 *
 * Example:
 *
 * const call = cancellableDebounce(() => console.info("foo"), 500);
 *
 * const cancelA = call();
 * const cancelB = call();
 *
 * cancelA(); // <-- will do nothing as this call was already cancelled by another call
 */
export function cancellableDebounce<A extends unknown[]>(callback: (...args: A) => void, time: number) {
  let currentTimeoutId: ReturnType<typeof setTimeout> | undefined;

  function cancelCurrent() {
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
      currentTimeoutId = undefined;
    }
  }

  function callDebounced(...args: A) {
    cancelCurrent();

    const thisCallTiemoutId = setTimeout(() => {
      callback(...args);
    }, time);

    currentTimeoutId = thisCallTiemoutId;

    return function cancelThisCall() {
      if (currentTimeoutId === thisCallTiemoutId) {
        cancelCurrent();
      }
    };
  }

  callDebounced.cancel = cancelCurrent;

  return callDebounced;
}
