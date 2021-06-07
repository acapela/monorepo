import { HTMLMotionProps, motion, Target as MotionAnimations } from "framer-motion";
import { forwardRef } from "react";
import styled from "styled-components";
import { objectMap } from "~shared/object";

interface Props extends HTMLMotionProps<"div"> {
  presenceStyles: PresenceStyles;
}

type MakePresenceTuple<T> = [initialAndExit: T, animate: T] | [initial: T, animate: T, exit: T];

export type PresenceStyles = {
  [key in keyof MotionAnimations]: MakePresenceTuple<MotionAnimations[key]>;
};

export const PresenceAnimator = forwardRef<HTMLDivElement, Props>(function PresenceAnimator(
  { presenceStyles, ...motionProps }: Props,
  ref
) {
  const { animate, exit, initial } = parsePresenceStyles(presenceStyles);
  return <UIHolder ref={ref} initial={initial} animate={animate} exit={exit} {...motionProps}></UIHolder>;
});

const UIHolder = styled(motion.div)`
  position: relative;
  will-change: transform, opacity;
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
