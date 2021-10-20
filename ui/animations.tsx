import { HTMLMotionProps, Transition } from "framer-motion";

import { namedForwardRef } from "~shared/react/namedForwardRef";

import { PresenceAnimator, PresenceStyles } from "./PresenceAnimator";

export const POP_ANIMATION_CONFIG: Transition = { type: "spring", bounce: 0, duration: 0.2 };

export function getSpringTransitionWithDuration(duration = 0.4): Transition {
  return { type: "spring", bounce: 0, duration };
}

export const POP_PRESENCE_STYLES: PresenceStyles = { opacity: [0, 1], y: [3, 0], scale: [0.95, 1] };
export const FADE_PRESENCE_STYLES: PresenceStyles = { opacity: [0, 1] };

export const PopPresenceAnimator = namedForwardRef<HTMLDivElement, HTMLMotionProps<"div">>(function PopPresenceAnimator(
  props,
  ref
) {
  return <PresenceAnimator ref={ref} {...props} presenceStyles={POP_PRESENCE_STYLES} />;
});

export const FadePresenceAnimator = namedForwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  function PopPresenceAnimator(props, ref) {
    return <PresenceAnimator ref={ref} {...props} presenceStyles={FADE_PRESENCE_STYLES} />;
  }
);
