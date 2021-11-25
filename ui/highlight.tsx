import { css, keyframes } from "styled-components";

import { theme } from "./theme";

export const highlightDropAnimation = keyframes`
  0% {
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  25% {
    opacity: 1;
    transform: scale(1)
  }


  100% {
    opacity: 0;
  }

`;

const HIGHLIGHT_OFFSET_PX = 0;

export const highlightOnceStyles = css`
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: ${-HIGHLIGHT_OFFSET_PX}px;
    left: ${-HIGHLIGHT_OFFSET_PX}px;
    right: ${-HIGHLIGHT_OFFSET_PX}px;
    bottom: ${-HIGHLIGHT_OFFSET_PX}px;
    animation: ${highlightDropAnimation} 2.5s ease-in-out both;
    ${theme.colors.secondary.opacity(0.2).asBg};
    ${theme.radius.secondaryItem};
    will-change: transform, opacity;
    contain: layout, paint;
    pointer-events: none !important;
  }
`;
