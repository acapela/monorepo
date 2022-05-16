import React from "react";
import { MouseEvent, ReactNode, useRef } from "react";
import styled from "styled-components";

import { BodyPortal } from "@aca/ui/BodyPortal";
import { useUnmountPresence } from "@aca/ui/presence";
import { theme } from "@aca/ui/theme";
import { zIndexValues } from "@aca/ui/theme/zIndex";

interface Props {
  children: ReactNode;
  onCloseRequest?: () => void;
  isTransparent?: boolean;
  className?: string;
}

const BACKGROUND_BLUR_SIZE_PX = 8;

export const ScreenCover = styled(function ScreenCover({
  children,
  onCloseRequest,
  isTransparent = true,
  className,
}: Props) {
  const isMounted = useUnmountPresence(200);
  const bodyCoverRef = useRef<HTMLDivElement>(null);

  function handleBodyCoverClick(event: MouseEvent) {
    if (event.target !== bodyCoverRef.current) return;

    event.stopPropagation();

    onCloseRequest?.();
  }

  return (
    <BodyPortal>
      <UIBodyCover
        ref={bodyCoverRef}
        className={className}
        isCovering={isMounted && !isTransparent}
        onClick={handleBodyCoverClick}
        enableBlur={isTransparent}
      >
        {children}
      </UIBodyCover>
    </BodyPortal>
  );
})``;

const background = theme.colors.primary;

const UIBodyCover = styled.div<{ enableBlur: boolean; isCovering: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: backdrop-filter, filter, transform, background-color;
  /* Fixes modal blur flickering: https://stackoverflow.com/questions/23619520/chrome-flickering-on-webkit-filter-blur/24062670 */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  backdrop-filter: blur(${(props) => (props.isCovering ? BACKGROUND_BLUR_SIZE_PX : 0)}px);
  background-color: ${(props) => (props.isCovering ? background.opacity(0.5) : background.opacity(0))};
  transition: 0.1s all;
  z-index: ${zIndexValues.overlay};
`;
