import React, { RefObject, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import styled from "styled-components";

import { useElementEvent } from "~shared/domEvents";
import { useResizeCallback } from "~shared/hooks/useResizeCallback";

interface Props {
  parentRef: RefObject<HTMLElement>;
  preventAutoScroll: boolean;
}

export interface ScrollHandle {
  scrollToBottom: (behavior: ScrollBehavior) => void;
}

const SCROLL_BOTTOM_TOLERANCE = 10;

/**
 * This component will manage keeping it's parent scrolled to bottom on content size changes.
 *
 * It's useful for cases like messages feed.
 */
export const ScrollToBottomMonitor = React.forwardRef<ScrollHandle, Props>(({ parentRef, preventAutoScroll }, ref) => {
  const monitorRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useRef(true);
  const didAutoScroll = useRef(false);

  useElementEvent(
    parentRef,
    "scroll",
    useCallback(() => {
      const parent = parentRef.current;
      if (parent && !didAutoScroll.current) {
        isScrolledToBottom.current =
          parent.scrollTop >= parent.scrollHeight - parent.clientHeight - SCROLL_BOTTOM_TOLERANCE;
      }
      didAutoScroll.current = false;
    }, [parentRef])
  );

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior) => {
      const parentNode = parentRef.current;
      if (!parentNode) {
        return;
      }

      // We need to distinguish programmatically-triggered scroll events from user-triggered ones
      // to retain a user's intention whether to stay scrolled to the bottom
      if (behavior === "auto") {
        parentNode.scrollTop = parentNode.scrollHeight - parentNode.clientHeight;
      } else {
        parentNode.scroll({ top: parentNode.scrollHeight - parentNode.clientHeight, behavior });
      }
    },
    [parentRef]
  );

  const tryAutoScroll = useCallback(() => {
    if (!preventAutoScroll && isScrolledToBottom.current) {
      didAutoScroll.current = true;
      scrollToBottom("auto");
    }
  }, [preventAutoScroll, scrollToBottom]);

  useImperativeHandle(ref, () => ({ scrollToBottom }));

  useResizeCallback(monitorRef, () => tryAutoScroll());
  useResizeCallback(parentRef, () => tryAutoScroll());

  // On mount try to scroll down without animation
  useIsomorphicLayoutEffect(() => {
    tryAutoScroll();
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
});

const UIContentSizeCaptureFlyer = styled.div<{}>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
`;
