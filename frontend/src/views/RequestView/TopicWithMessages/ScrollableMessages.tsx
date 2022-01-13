import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useTopicStoreContext } from "@aca/frontend/topics/TopicStore";
import { styledObserver } from "@aca/shared/component";
import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { select } from "@aca/shared/sharedState";
import { HorizontalSpacingContainer } from "@aca/ui/layout";

import { ScrollHandle, ScrollToBottomMonitor } from "./ScrollToBottomMonitor";
import { MESSAGES_VIEW_MAX_WIDTH_PX } from "./ui";

interface Props {
  children: ReactNode;
  className?: string;
}

export const ScrollableMessages = styledObserver<Props>(
  React.forwardRef<ScrollHandle, Props>(({ children, className }, ref) => {
    const holderRef = useRef<HTMLDivElement>(null);

    const topicContext = useTopicStoreContext();
    const isInEditMode = select(() => !!topicContext?.editedMessageId);

    const [isSmoothScrollingEnabled, { set: setSmoothScrolling, unset: setInstantScrolling }] = useBoolean(true);

    return (
      <UIHolder className={className} ref={holderRef} $scrollBehavior={isSmoothScrollingEnabled ? "smooth" : "auto"}>
        <UIInner>
          <ScrollToBottomMonitor
            ref={ref}
            parentRef={holderRef}
            preventAutoScroll={isInEditMode}
            onScrollBegin={setInstantScrolling}
            onScrollEnd={setSmoothScrolling}
          />
          {children}
        </UIInner>
      </UIHolder>
    );
  })
)``;

const UIHolder = styled.div<{ $scrollBehavior: string }>`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex-grow: 1;
  scroll-behavior: ${(props) => props.$scrollBehavior};
`;

const UIInner = styled(HorizontalSpacingContainer)<{}>`
  position: relative;
  padding-bottom: 40px;
  max-width: ${MESSAGES_VIEW_MAX_WIDTH_PX}px;
  width: 100%;
`;
