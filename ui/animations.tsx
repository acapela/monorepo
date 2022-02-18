import { HTMLMotionProps, Transition } from "framer-motion";
import React from "react";
import { css, keyframes } from "styled-components";

import { namedForwardRef } from "@aca/shared/react/namedForwardRef";

import { PresenceAnimator, PresenceStyles } from "./PresenceAnimator";

export const POP_ANIMATION_CONFIG: Transition = { type: "spring", bounce: 0, duration: 0.3 };

export function getSpringTransitionWithDuration(duration = 0.4): Transition {
  return { type: "spring", bounce: 0, duration };
}

export const POP_PRESENCE_STYLES: PresenceStyles = { opacity: [0, 1], y: [3, 0], scale: [0.95, 1] };
export const FADE_PRESENCE_STYLES: PresenceStyles = { opacity: [0, 1] };

interface Props extends HTMLMotionProps<"div"> {
  className?: string;
}

export const PopPresenceAnimator = namedForwardRef<HTMLDivElement, Props>(function PopPresenceAnimator(props, ref) {
  return <PresenceAnimator ref={ref} {...props} presenceStyles={POP_PRESENCE_STYLES} />;
});

export const FadePresenceAnimator = namedForwardRef<HTMLDivElement, Props>(function PopPresenceAnimator(props, ref) {
  return <PresenceAnimator ref={ref} {...props} presenceStyles={FADE_PRESENCE_STYLES} />;
});

export const fadeInKeyframes = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1
  }
`;

export function getFadeInAnimationStyles(time = 0.2) {
  return css`
    animation: ${fadeInKeyframes} ${time}s ease-in-out;
    animation-fill-mode: both;
    will-change: opacity;
  `;
}
