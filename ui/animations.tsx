import { Transition, HTMLMotionProps } from "framer-motion";
import { forwardRef, RefObject } from "react";
import { PresenceStyles, PresenceAnimator } from "./PresenceAnimator";

export const POP_ANIMATION_CONFIG: Transition = { type: "spring", bounce: 0, duration: 0.2 };

export function getSpringTransitionWithDuration(duration = 0.4): Transition {
  return { type: "spring", bounce: 0, duration };
}

export const POP_PRESENCE_STYLES: PresenceStyles = { opacity: [0, 1], y: [3, 0], scale: [0.95, 1] };

export const PopPresenceAnimator = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(function PopPresenceAnimator(
  props,
  ref
) {
  return <PresenceAnimator ref={ref} {...props} presenceStyles={POP_PRESENCE_STYLES} />;
});
