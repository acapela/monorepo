import { DependencyList, useEffect, useRef } from "react";

interface Props {
  dependencies: DependencyList;
  /**
   * The gap ensures you don't need to be precisely at the very end of the scroll for auto scroll to work
   */
  gap: number;
}

function scrollToBottom(node: HTMLElement) {
  node.scrollTop = node.scrollHeight - node.clientHeight;
}

export const useScrollToBottom = ({ dependencies, gap = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef<boolean>(false);

  // Tracking scroll position
  const onScroll = () => {
    if (!ref.current) {
      return;
    }

    const scrollTop = ref.current.scrollTop;
    const rawVisibleHeight = ref.current.scrollHeight - ref.current.clientHeight;
    const adjustedVisibleHeight = rawVisibleHeight - gap;

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
  }, [dependencies]);

  // Scroll to bottom on initial render
  useEffect(() => {
    if (ref.current) {
      scrollToBottom(ref.current);
    }
  }, []);

  return { ref, onScroll };
};
