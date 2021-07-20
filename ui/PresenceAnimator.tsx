import { HTMLMotionProps, motion, Target as MotionAnimations } from "framer-motion";
import { forwardRef } from "react";
import styled from "styled-components";
import { objectMap } from "~shared/object";
import { POP_ANIMATION_CONFIG } from "./animations";

interface Props extends HTMLMotionProps<"div"> {
  presenceStyles: PresenceStyles;
}

type MakePresenceTuple<T> = [initialAndExit: T, animate: T] | [initial: T, animate: T, exit: T];

export type PresenceStyles = {
  [key in keyof MotionAnimations]: MakePresenceTuple<MotionAnimations[key]>;
};

export const PresenceAnimator = forwardRef<HTMLDivElement, Props>(function PresenceAnimator(
  { presenceStyles, transition, ...motionProps }: Props,
  ref
) {
  transition = { ...POP_ANIMATION_CONFIG, ...transition };
  const { animate, exit, initial } = parsePresenceStyles(presenceStyles);
  return (
    <UIHolder
      ref={ref}
      transition={transition}
      initial={initial}
      animate={animate}
      exit={exit}
      {...motionProps}
    ></UIHolder>
  );
});

/**
 * React `forwardRef` does not pick provided function name so component is annonymous. This could result in next.js
 * fast refresh being confused an warning about it.
 *
 * TODO: Maybe we should create `namedForwardRef` that would do this automatically. I think, tho, that it would be a bit
 * confusing to devs 'why do you use custom forwardRef function?'
 *
 */
PresenceAnimator.displayName = "PresenceAnimator";

const UIHolder = styled(motion.div)`
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
