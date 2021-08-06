import { RefObject, useEffect, useRef, useState } from "react";
import { useDebouncedDocumentEvent, useDocumentEvent } from "~shared/domEvents";
import { TooltipLabel } from "./TooltipLabel";
import { AnimatePresence } from "framer-motion";
import { useDebouncedValue } from "~shared/hooks/useDebouncedValue";
import { getObjectKey } from "~shared/object";

/**
 * This component will handle showing tooltips for every element that has html `data-tooltip` attribute.
 *
 * It's good to render it only once and close to the root of the app.
 */
export function TooltipsRenderer() {
  const [currentTooltipAnchor, setCurrentTooltipAnchor] = useState<HTMLElement | null>(null);

  const tooltipAnchorToRender = useDebouncedValue(currentTooltipAnchor, { onDelay: 150, offDelay: 0 });

  const anchorRef = useRef(tooltipAnchorToRender ?? null);

  anchorRef.current = tooltipAnchorToRender ?? null;

  // data-tooltip attribute might change while tooltip is rendered, let's make sure we're watching it's changes.
  const tooltipLabel = useDOMAttributeValue(anchorRef, "data-tooltip");

  useDocumentEvent(
    "pointerenter",
    (event) => {
      // On mouse enter, try to check if it is data-tooltip element, if so - mark it as active tooltip ref.
      const target = event.target as HTMLElement;
      const tooltipInfo = getClosestElementTooltipInfo(target);

      if (tooltipInfo) {
        setCurrentTooltipAnchor(tooltipInfo.element);
      }
    },
    { capture: true }
  );

  useDocumentEvent(
    "pointerleave",
    (event) => {
      const target = event.target as HTMLElement;

      // If it was current tooltip, clear it.
      if (target === currentTooltipAnchor) {
        setCurrentTooltipAnchor(null);
      }
    },
    { capture: true }
  );

  useDocumentEvent("blur", () => {
    setCurrentTooltipAnchor(null);
  });

  useDebouncedDocumentEvent(
    "scroll",
    () => {
      setCurrentTooltipAnchor(null);
    },
    1000,
    { capture: true }
  );

  return (
    <AnimatePresence>
      {tooltipAnchorToRender && typeof tooltipLabel === "string" && (
        <TooltipLabel
          // We're using key to re-mount tooltip with animation if one tooltip replaces other instantly without pause in between.
          key={getObjectKey(anchorRef.current)}
          anchorRef={anchorRef}
          label={tooltipLabel}
        />
      )}
    </AnimatePresence>
  );
}

interface TooltipInfo {
  label: string;
  element: HTMLElement;
}

/**
 * A bit enhanced attribute read function that will map string values like "false" to boolean false.
 */
function getElementAttribute(element: HTMLElement | null, attributeName: string) {
  if (!element) return null;

  const rawValue = element?.getAttribute?.(attributeName) ?? null;

  if (rawValue === "false") return false;
  if (rawValue === "true") return true;

  return rawValue;
}

function getElementTooltipInfo(element: HTMLElement): TooltipInfo | null {
  const label = getElementAttribute(element, "data-tooltip");

  if (typeof label !== "string") return null;

  return {
    label,
    element,
  };
}

/**
 * Will try to find tooltip info including all parents of given element.
 */
function getClosestElementTooltipInfo(element: HTMLElement) {
  let currentCandidate: HTMLElement | null = element;

  while (currentCandidate) {
    const tooltipInfo = getElementTooltipInfo(currentCandidate);

    if (tooltipInfo) return tooltipInfo;

    currentCandidate = currentCandidate.parentElement;
  }

  return null;
}

/**
 * Will return current value of provided attribute and watch attribute value changes.
 */
function useDOMAttributeValue(ref: RefObject<HTMLElement>, attributeName: string) {
  const [value, setValue] = useState(() => getElementAttribute(ref.current, attributeName));

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

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
