import { HTMLMotionProps, motion, Target as MotionAnimations } from "framer-motion";
import styled from "styled-components";
import { objectMap } from "~shared/object";

interface Props extends HTMLMotionProps<"div"> {
  presenceStyles: PresenceStyles;
}

type MakePresenceTuple<T> = [initialAndExit: T, animate: T] | [initial: T, animate: T, exit: T];

type PresenceStyles = {
  [key in keyof MotionAnimations]: MakePresenceTuple<MotionAnimations[key]>;
};

export function PresenceAnimator({ presenceStyles, ...motionProps }: Props) {
  const { animate, exit, initial } = parsePresenceStyles(presenceStyles);
  return <UIHolder initial={initial} animate={animate} exit={exit} {...motionProps}></UIHolder>;
}

const UIHolder = styled(motion.div)`
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
