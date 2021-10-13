import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { styledObserver } from "~shared/component";
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
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const UIInner = styled.div<{}>`
  position: relative;
  padding-bottom: 40px;
  max-width: 800px;
`;
