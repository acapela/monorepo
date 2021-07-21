import React, { ReactNode, useRef } from "react";
import styled from "styled-components";
import { ScrollToBottomMonitor } from "./ScrollToBottomMonitor";
import { getDidUserJustInteract } from "~shared/interaction/isUserInteracting";

interface Props {
  children: ReactNode;
  className?: string;
}

export const ScrollableMessages = styled(({ children, className }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);

  return (
    <UIHolder className={className} ref={holderRef}>
      <UIInner>
        <ScrollToBottomMonitor
          parentRef={holderRef}
          getShouldScroll={() => {
            if (getDidUserJustInteract()) {
              return false;
            }

            return true;
          }}
        />

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
