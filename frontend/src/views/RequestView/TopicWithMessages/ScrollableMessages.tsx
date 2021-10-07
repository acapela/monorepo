import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { styledObserver } from "~frontend/../../shared/component";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { select } from "~shared/sharedState";

import { ScrollHandle, ScrollToBottomMonitor } from "./ScrollToBottomMonitor";

interface Props {
  children: ReactNode;
  className?: string;
}

export const ScrollableMessages = styledObserver<Props>(
  React.forwardRef<ScrollHandle, Props>(({ children, className }, ref) => {
    const holderRef = useRef<HTMLDivElement>(null);

    const topicContext = useTopicStoreContext();
    const isInEditMode = select(() => !!topicContext?.editedMessageId);

    return (
      <UIHolder className={className} ref={holderRef}>
        <UIInner>
          <ScrollToBottomMonitor ref={ref} parentRef={holderRef} preventAutoScroll={isInEditMode} />
          {children}
        </UIInner>
      </UIHolder>
    );
  })
)``;

const UIHolder = styled.div<{}>`
  overflow-y: scroll;
  /* Avoid scrollbar handle to fly over messages */
  padding-right: 20px;
`;

const UIInner = styled.div<{}>`
  position: relative;
`;
