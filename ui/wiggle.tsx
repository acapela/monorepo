import { css, keyframes } from "styled-components";

const WIGGLE_AMPLITUDE = 1;

export const wiggleAnimation = keyframes`
  10%, 90% {
    transform: translate3d(-${WIGGLE_AMPLITUDE / 4}px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(${WIGGLE_AMPLITUDE / 2}px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-${WIGGLE_AMPLITUDE}px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(${WIGGLE_AMPLITUDE}px, 0, 0);
  }
`;

export const wiggleOnceStyles = css`
  animation: ${wiggleAnimation} 1s;
`;
