import { HTMLMotionProps, Target as MotionAnimations, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { styledForwardRef } from "@aca/shared/component";
import { objectMap } from "@aca/shared/object";

import { POP_ANIMATION_CONFIG } from "./animations";

interface Props extends HTMLMotionProps<"div"> {
  presenceStyles: PresenceStyles;
  className?: string;
}

type MakePresenceTuple<T> = [initialAndExit: T, animate: T] | [initial: T, animate: T, exit: T];

export type PresenceStyles = {
  [key in keyof MotionAnimations]: MakePresenceTuple<MotionAnimations[key]>;
};

export const PresenceAnimator = styledForwardRef<HTMLDivElement, Props>(function PresenceAnimator(
  { presenceStyles, transition, className, ...motionProps }: Props,
  ref
) {
  transition = { ...POP_ANIMATION_CONFIG, ...transition };
  const { animate, exit, initial } = parsePresenceStyles(presenceStyles);
  return (
    <UIHolder
      ref={ref}
      className={className}
      transition={transition}
      initial={initial}
      animate={animate}
      exit={exit}
      {...motionProps}
    ></UIHolder>
  );
})``;

const UIHolder = styled(motion.div)<{}>`
  position: relative;
  will-change: transform, opacity;
  /* Add initial transform before framer motion adds it via styles */
  transform: translate3d(0, 0, 0);
`;

function parsePresenceStyles(presenceStyles: PresenceStyles) {
  const initial = objectMap(presenceStyles, (stylesTuple) => {
    return stylesTuple?.[0];
  }) as MotionAnimations;

  const animate = objectMap(presenceStyles, (stylesTuple) => {
    return stylesTuple?.[1];
  }) as MotionAnimations;

  const exit = objectMap(presenceStyles, (stylesTuple) => {
    return stylesTuple?.[2] ?? stylesTuple?.[0];
  }) as MotionAnimations;

  return { initial, animate, exit };
}
