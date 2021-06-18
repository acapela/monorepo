import { useEffect, useRef } from "react";
import { RefObject } from "react";
import styled from "styled-components";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { useResizeCallback } from "~shared/hooks/useResizeCallback";
import { useLayoutEffect } from "react";

interface Props {
  parentRef: RefObject<HTMLElement>;
  scrollToBottomKey?: string;
  scrollInitially?: boolean;
  isDisabled?: boolean;
}

function scrollToBottom(element: HTMLElement, behavior: ScrollBehavior = "smooth") {
  if (behavior === "auto") {
    element.scrollTop = element.scrollHeight - element.clientHeight;
    return;
  }

  element.scroll({ top: element.scrollHeight - element.clientHeight, behavior });
}

/**
 * Time after initial mount when we'll scroll without animations.
 */

/**
 * This component will manage keeping it's parent scrolled to bottom on content size changes.
 *
 * It's useful for cases like messages feed.
 */
export function ScrollToBottomMonitor({
  parentRef,
  scrollToBottomKey,
  scrollInitially = true,
  isDisabled = false,
}: Props) {
  const monitorRef = useRef<HTMLDivElement>(null);

  function performScrollToBottom(behavior: ScrollBehavior) {
    if (isDisabled) return;

    const parentNode = parentRef.current;

    if (!parentNode) return;

    scrollToBottom(parentNode, behavior);
  }

  useResizeCallback(monitorRef, () => performScrollToBottom("auto"));
  useResizeCallback(parentRef, () => performScrollToBottom("auto"));

  // On mount try to scroll down without animation
  useLayoutEffect(() => {
    if (!scrollInitially) return;

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

  useDependencyChangeEffect(() => performScrollToBottom("smooth"), [scrollToBottomKey]);

  return <UIContentSizeCaptureFlyer ref={monitorRef} />;
}

const UIContentSizeCaptureFlyer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
`;
