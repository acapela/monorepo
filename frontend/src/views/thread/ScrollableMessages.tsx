import React, { useRef } from "react";
import styled from "styled-components";
import { useScrollToBottom } from "@acapela/frontend/hooks/useScrollToBottom";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const PureScrollableMessages = ({ children, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useScrollToBottom({ ref, bottomMargin: 80 });

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export const ScrollableMessages = styled(PureScrollableMessages)``;
