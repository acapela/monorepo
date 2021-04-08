import React, { DependencyList } from "react";
import styled from "styled-components";
import { useScrollToBottom } from "@acapela/frontend/hooks/useScrollToBottom";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ScrollableMessages = ({ children, className }: Props) => {
  const { ref, onScroll } = useScrollToBottom({ dependencies: children as DependencyList, gap: 80 });

  return (
    <div className={className} ref={ref} onScroll={onScroll}>
      {children}
    </div>
  );
};

export default styled(ScrollableMessages)``;
