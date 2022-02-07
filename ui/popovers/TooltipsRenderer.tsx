import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { useDebouncedDocumentEvent, useDocumentEvent } from "@aca/shared/domEvents";
import { useDebouncedValue } from "@aca/shared/hooks/useDebouncedValue";
import { getObjectKey } from "@aca/shared/object";
import { createInterval } from "@aca/shared/time";

import { TooltipLabel } from "./TooltipLabel";
import { getClosestElementTooltipHost, useElementTooltipConfig } from "./tooltipProps";

/**
 * This component will handle showing tooltips for every element that has html `data-tooltip` attribute.
 *
 * It's good to render it only once and close to the root of the app.
 */
export function TooltipsRenderer() {
  const [currentTooltipAnchor, setCurrentTooltipAnchor] = useState<HTMLElement | null>(null);

  const tooltipAnchorToRender = useDebouncedValue(currentTooltipAnchor, (currentTooltipAnchor) =>
    currentTooltipAnchor ? 150 : 0
  );

  const anchorRef = useRef(tooltipAnchorToRender ?? null);

  anchorRef.current = tooltipAnchorToRender ?? null;

  // data-tooltip attribute might change while tooltip is rendered, let's make sure we're watching it's changes.
  const tooltipConfig = useElementTooltipConfig(anchorRef);

  useDocumentEvent(
    "pointerenter",
    (event) => {
      // On mouse enter, try to check if it is data-tooltip element, if so - mark it as active tooltip ref.
      const target = event.target as HTMLElement;
      const tooltipHost = getClosestElementTooltipHost(target);

      if (!tooltipHost) return;

      if (tooltipHost.matches("[data-no-tooltips] *")) return;

      setCurrentTooltipAnchor(tooltipHost);
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

  // If active tooltip element is clicked - instantly hide tooltip
  useDocumentEvent(
    "click",
    (event) => {
      const target = event.target as HTMLElement;
      const tooltipHost = getClosestElementTooltipHost(target);

      if (!tooltipHost) return;

      if (currentTooltipAnchor === tooltipHost) {
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

  useElementRemovedFromDOM(currentTooltipAnchor, () => {
    setCurrentTooltipAnchor(null);
  });

  return (
    <AnimatePresence>
      {tooltipAnchorToRender && tooltipConfig && (
        <TooltipLabel
          // We're using key to re-mount tooltip with animation if one tooltip replaces other instantly without pause in between.
          key={getObjectKey(anchorRef.current)}
          anchorRef={anchorRef}
          label={tooltipConfig.label}
          shortcut={tooltipConfig.shortcut ?? undefined}
        />
      )}
    </AnimatePresence>
  );
}

function getIsElementDetachedFromDOM(element: HTMLElement) {
  return !document.body.contains(element);
}

function useElementRemovedFromDOM(element: HTMLElement | null, callback: () => void) {
  useEffect(() => {
    if (!element) return;

    if (getIsElementDetachedFromDOM(element)) {
      callback();
      return;
    }

    /**
     * Note - I first tried 'solid' solution with MutationObserver - watching parent for removed direct children.
     * It worked, but not if parent was removed at once together with child. This was breaking for large DOM changes
     * like route change etc.
     *
     * `getIsElementDetachedFromDOM` is super quick (measure shows 0ms) so it seems safe to do this this way.
     */
    return createInterval(() => {
      if (getIsElementDetachedFromDOM(element)) {
        callback();
      }
    }, 250);
  }, [element, callback]);
}
