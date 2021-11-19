import { RefObject, useEffect, useState } from "react";

/**
 * Will return current value of provided attribute and watch attribute value changes.
 */
export function useDOMAttributeValue(ref: RefObject<HTMLElement>, attributeName: string) {
  const [value, setValue] = useState(() => getElementAttribute(ref.current, attributeName));

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      setValue(null);
      return;
    }

    const updateAttributeValue = () => {
      const attributeValue = getElementAttribute(element, attributeName);
      setValue(attributeValue);
    };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes") {
          updateAttributeValue();
        }
      });
    });

    observer.observe(element, {
      attributes: true,
      // attributeFilter: [attributeName],
    });

    return () => {
      observer.disconnect();
    };
  }, [ref, ref.current, attributeName]);

  /**
   * If ref is available, try to read the value instantly.
   */
  const valueNow = ref.current?.getAttribute?.(attributeName);

  return valueNow ?? value;
}

/**
 * A bit enhanced attribute read function that will map string values like "false" to boolean false.
 */
export function getElementAttribute(element: HTMLElement | null, attributeName: string) {
  if (!element) return null;

  const rawValue = element?.getAttribute?.(attributeName) ?? null;

  if (rawValue === "false") return false;
  if (rawValue === "true") return true;

  return rawValue;
}
