import { RefObject, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { useResizeCallback } from "~shared/hooks/useResizeCallback";
import { useIsomorphicLayoutEffect } from "react-use";

interface Props {
  parentRef: RefObject<HTMLElement>;
  getShouldScroll: () => boolean;
}

function scrollToBottom(element: HTMLElement, behavior: ScrollBehavior = "smooth") {
  if (behavior === "auto") {
    element.scrollTop = element.scrollHeight - element.clientHeight;
    return;
  }

  element.scroll({ top: element.scrollHeight - element.clientHeight, behavior });
}

/**
 * This component will manage keeping it's parent scrolled to bottom on content size changes.
 *
 * It's useful for cases like messages feed.
 */
export function ScrollToBottomMonitor({ parentRef, getShouldScroll }: Props) {
  const monitorRef = useRef<HTMLDivElement>(null);

  const performScrollToBottom = useCallback(
    (behavior: ScrollBehavior) => {
      const parentNode = parentRef.current;
      if (!parentNode || !getShouldScroll()) {
        return;
      }

      if (navigator.userAgent.includes("AppleWebKit")) {
        // Safari schedules ~some sync work which stops bottom scrolling from working
        // This little hack, while not nice, does make it work
        setTimeout(() => {
          scrollToBottom(parentNode, behavior);
        });
      } else {
        scrollToBottom(parentNode, behavior);
      }
    },
    [getShouldScroll]
  );

  useResizeCallback(monitorRef, () => performScrollToBottom("auto"));
  useResizeCallback(parentRef, () => performScrollToBottom("auto"));

  // On mount try to scroll down without animation
  useIsomorphicLayoutEffect(() => {
    performScrollToBottom("auto");
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const parent = monitorRef.current?.parentElement;

      if (!parent) return;

      if (getComputedStyle(parent).position === "static") {
        console.warn(
          `Parent of ScrollToBottomMonitor cannot have 'static' position. Use relative, absolute, fixed etc.`,
          { parent }
        );
      }
    }
  });

  return <UIContentSizeCaptureFlyer ref={monitorRef} />;
}

const UIContentSizeCaptureFlyer = styled.div<{}>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
`;
