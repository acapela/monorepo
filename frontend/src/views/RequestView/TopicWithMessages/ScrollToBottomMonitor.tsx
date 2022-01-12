import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { RefObject, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import styled from "styled-components";

import { useTopicStoreContext } from "@aca/frontend/topics/TopicStore";
import { useElementEvent } from "@aca/shared/domEvents";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";

interface Props {
  parentRef: RefObject<HTMLElement>;
  preventAutoScroll: boolean;
  onScrollBegin?: () => void;
  onScrollEnd?: () => void;
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
const _ScrollToBottomMonitor = React.forwardRef<ScrollHandle, Props>(
  ({ parentRef, preventAutoScroll, onScrollBegin, onScrollEnd }, ref) => {
    const topicContext = useTopicStoreContext();
    const firstUnreadMessageElement = topicContext?.firstUnreadMessageElement;

    const monitorRef = useRef<HTMLDivElement>(null);
    const isScrolledToBottom = useRef(true);
    const didAutoScroll = useRef(false);

    useElementEvent(
      parentRef,
      "scroll",
      useCallback(() => {
        const parent = parentRef.current;
        if (parent && !didAutoScroll.current) {
          // We need to distinguish programmatically-triggered scroll events from user-triggered ones
          // to retain a user's intention whether to stay scrolled to the bottom
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

        if (behavior === "auto") {
          parentNode.scrollTop = parentNode.scrollHeight - parentNode.clientHeight;
        } else {
          parentNode.scroll({ top: parentNode.scrollHeight - parentNode.clientHeight, behavior });
        }
      },
      [parentRef]
    );

    const tryAutoScroll = useCallback(() => {
      runInAction(() => {
        if (!preventAutoScroll && isScrolledToBottom.current) {
          onScrollBegin?.();
          didAutoScroll.current = true;
          if (firstUnreadMessageElement) {
            const scrollToTopOfElement = true;
            firstUnreadMessageElement.scrollIntoView(scrollToTopOfElement);
            isScrolledToBottom.current = false;

            if (topicContext) {
              topicContext.firstUnreadMessageElement = null;
            }
          } else {
            scrollToBottom("auto");
          }
          onScrollEnd?.();
        }
      });
    }, [firstUnreadMessageElement, preventAutoScroll, scrollToBottom, topicContext, onScrollBegin, onScrollEnd]);

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
  }
);

export const ScrollToBottomMonitor = observer(_ScrollToBottomMonitor);

const UIContentSizeCaptureFlyer = styled.div<{}>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
`;
