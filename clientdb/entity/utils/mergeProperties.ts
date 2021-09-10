export function mergeProperties<I, A>(input: I, propertiesToAdd: A): I & A {
  const keysToAdd = Object.keys(propertiesToAdd);

  for (const keyToAdd of keysToAdd) {
    const descriptor = Object.getOwnPropertyDescriptor(propertiesToAdd, keyToAdd);

    if (!descriptor) continue;

    Object.defineProperty(input, keyToAdd, descriptor);
  }

  return input as I & A;
}
