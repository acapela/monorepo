import React, { ReactNode, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Component that will increase height if having new content, but never decrease it
 * (even if becoming empty)
 */
export function NeverDecreaseHeight({ children, className }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState(0);

  useLayoutEffect(() => {
    const holder = holderRef.current;

    if (!holder) return;

    const height = holder.getBoundingClientRect().height;

    if (height <= minHeight) return;

    setMinHeight(height);
  });

  return (
    <UIHolder ref={holderRef} style={{ minHeight: `${minHeight}px` }} className={className}>
      {children}
    </UIHolder>
  );
}

const UIHolder = styled.div``;
