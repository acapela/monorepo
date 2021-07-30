import React, { ReactNode, useCallback, useRef } from "react";
import styled from "styled-components";
import { ScrollToBottomMonitor } from "./ScrollToBottomMonitor";
import { assertDefined } from "~shared/assert";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { select } from "~shared/sharedState";
import { useElementEvent } from "~shared/domEvents";

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
  useElementEvent(holderRef, "scroll", handleScroll);

  const topicContext = useTopicStoreContext();
  const isInEditMode = select(() => !!topicContext.editedMessageId);

  const getShouldScroll = useCallback(() => isScrolledToBottom.current && !isInEditMode, [isInEditMode]);
  return (
    <UIHolder className={className} ref={holderRef}>
      <UIInner>
        <ScrollToBottomMonitor parentRef={holderRef} getShouldScroll={getShouldScroll} />
        {children}
      </UIInner>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  overflow-y: scroll;
  /* Avoid scrollbar handle to fly over messages */
  padding-right: 20px;
`;

const UIInner = styled.div<{}>`
  position: relative;
`;
