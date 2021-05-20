import React, { ReactNode, useRef } from "react";
import styled from "styled-components";
import { useScrollToBottom } from "~frontend/hooks/useScrollToBottom";

interface Props {
  children: ReactNode;
  className?: string;
}

const UIHolder = styled.div`
  overflow-y: scroll;
  /* Avoid scrollbar handle to fly over messages */
  padding-right: 20px;
`;

const ScrollableMessagesRaw = ({ children, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useScrollToBottom({ ref, bottomMargin: 80 });

  return (
    <UIHolder className={className} ref={ref}>
      {children}
    </UIHolder>
  );
};

export const ScrollableMessages = styled(ScrollableMessagesRaw)``;
