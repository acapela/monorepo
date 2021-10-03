/**
 * Nearly identical to simply doing {...foo, ...bar}.
 *
 * Difference is when foo or bar has getter properties. If
 * const foo = { get prop() { return 42 } }
 *
 * doing { ...foo } would simply unwrap getter value once and pass it. Thus as a result there will be no getter anymore.
 */
export function mergeProperties<I, A>(input: I, propertiesToAdd: A): I & A {
  const keysToAdd = Object.keys(propertiesToAdd);

  for (const keyToAdd of keysToAdd) {
    const descriptor = Object.getOwnPropertyDescriptor(propertiesToAdd, keyToAdd);

    if (!descriptor) continue;

    Object.defineProperty(input, keyToAdd, descriptor);
  }

  return input as I & A;
}
