import { RefObject, useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "@acapela/frontend/hooks/useIsomorphicLayoutEffect";

interface ScrollToBottomConfig {
  ref: RefObject<HTMLElement>;
  /**
   * This gives additional margin from the bottom
   * So you don't need to be precisely at the very end of the scroll for auto scroll to work
   */
  bottomMargin: number;
}

function scrollToBottom(node: HTMLElement) {
  node.scrollTop = node.scrollHeight - node.clientHeight;
}

export const useScrollToBottom = ({ ref, bottomMargin = 0 }: ScrollToBottomConfig) => {
  const shouldAutoScroll = useRef<boolean>(false);

  // Tracking scroll position
  const onScroll = () => {
    if (!ref.current) {
      return;
    }

    const scrollTop = ref.current.scrollTop;
    const rawVisibleHeight = ref.current.scrollHeight - ref.current.clientHeight;
    const adjustedVisibleHeight = rawVisibleHeight - bottomMargin;

    shouldAutoScroll.current = scrollTop >= adjustedVisibleHeight;
  };

  // Scroll to bottom if we are enough close to the bottom
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (shouldAutoScroll.current) {
      scrollToBottom(ref.current);
    }
  });

  // Scroll to bottom on initial render
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    scrollToBottom(ref.current);
    ref.current.addEventListener("scroll", onScroll);

    return () => ref.current?.removeEventListener("scroll", onScroll);
  }, [ref]);
};
