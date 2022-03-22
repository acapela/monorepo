interface ValueBox<V> {
  value: V;
}

export function createLazyChangeCallback<V>(callback: (value: V) => void) {
  let lastValue: ValueBox<V> | null = null;

  function makeCall(value: V) {
    lastValue = { value };

    callback(value);
  }

  return function callLazy(value: V, force = false) {
    if (force) {
      makeCall(value);
      return;
    }

    if (lastValue && lastValue.value === value) return;

    makeCall(value);
  };
}
