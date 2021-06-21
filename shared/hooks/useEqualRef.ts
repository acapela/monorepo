import { isEqual } from "lodash";
import { useRef } from "react";

/**
 * It will return reference to previous value if new value is equal old one.
 *
 * Example.
 * const a = { foo: 1 }
 * const b = { foo: 1 }
 *
 * Note: a and b are equal, but are different object refs.
 *
 * Now
 * const output = useEqualRef(a);
 * output === a; // true;
 *
 * and on the next render
 * const output = useEqualRef(b);
 * output === a; // true;
 *
 * Note: Ref is still pointing to `a`, even tho we provided `b` value to the hook on the next render.
 *
 * It kept `a` ref because new value was equal old one.
 */
export function useEqualRef<T>(value: T) {
  const valueRef = useRef(value);

  if (!isEqual(valueRef.current, value)) {
    valueRef.current = value;
  }

  return valueRef.current;
}
