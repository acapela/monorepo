import React, { ReactNode, useCallback, useRef } from "react";
import styled from "styled-components";
import { ScrollToBottomMonitor } from "./ScrollToBottomMonitor";
import { assertDefined } from "~shared/assert";
import { useEventListener } from "~shared/hooks/useEventListener";

interface Props {
  children: ReactNode;
  className?: string;
}

export const ScrollableMessages = styled(({ children, className }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useRef(true);

  const handleScroll = useCallback(() => {
    const parent = assertDefined(holderRef.current, "Event can't have been called on deleted element");
    isScrolledToBottom.current = parent.scrollTop == parent.scrollHeight - parent.clientHeight;
  }, []);
  useEventListener(holderRef.current, "scroll", handleScroll);

  return (
    <UIHolder className={className} ref={holderRef}>
      <UIInner>
        <ScrollToBottomMonitor parentRef={holderRef} getShouldScroll={() => isScrolledToBottom.current} />
        {children}
      </UIInner>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  overflow-y: scroll;
  /* Avoid scrollbar handle to fly over messages */
  padding-right: 20px;
`;

const UIInner = styled.div`
  position: relative;
`;
