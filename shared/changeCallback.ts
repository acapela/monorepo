interface ValueBox<V> {
  value: V;
}

export function createChangeCallback<V>(callback: (value: V) => void) {
  let lastValue: ValueBox<V> | null = null;

  return function setWhenNewValue(value: V) {
    if (lastValue && lastValue.value === value) return;

    lastValue = { value };

    callback(value);
  };
}
