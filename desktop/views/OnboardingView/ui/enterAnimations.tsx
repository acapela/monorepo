import { Transition, Variants, motion } from "framer-motion";
import React, { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

/**
 * Utils for creating staggered children animations (children animating one after another (including nesting))
 * 1. wrap view in <OnboardingAnimationsOrchestrator>
 * 2. anywhere inside put <OnboardingAnimationItem>Foo</OnboardingAnimationItem>
 *
 * Animation delay of <OnboardingAnimationItem> will be automatically calculated depending on which child in order it is
 *
 * Note: nested <OnboardingAnimationItem> have shorter stagger delay between nested children
 * to avoid animation being too long
 */

const springTransition: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 60,
  mass: 3,
};

const exitTransition: Transition = {
  duration: 0.2,
};

const NEXT_CHILD_DELAY = 0.066;

const Y_OFFSET = -20;

const containerVariants: Variants = {
  initial: {
    transition: {
      when: "beforeChildren",
      staggerChildren: NEXT_CHILD_DELAY,
      ...springTransition,
    },
  },
  enter: {
    transition: {
      when: "beforeChildren",
      staggerChildren: NEXT_CHILD_DELAY,
      ...springTransition,
    },
  },
  // Exit animation will fade entire container, will not stagger children
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      ...exitTransition,
    },
  },
};

const childVariants: Variants = {
  initial: {
    y: Y_OFFSET,
    opacity: 0,
    transition: { ...springTransition, staggerChildren: NEXT_CHILD_DELAY / 2 },
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: { ...springTransition, staggerChildren: NEXT_CHILD_DELAY / 2 },
  },
  exit: {
    transition: { ...exitTransition },
  },
};

/**
 * Every <OnboardingAnimationItem> inside this component will fade in with nice animation.
 * All OnboardingAnimationItem's will animate with proper delay, so they fade in one after another
 * (no matter how deep they are in React tree)
 */
export function OnboardingAnimationsOrchestrator({ children }: PropsWithChildren<{}>) {
  return (
    <UIHolder variants={containerVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </UIHolder>
  );
}

const UIHolder = styled(motion.div)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  will-change: transform, opacity;
`;

interface OnboardingAnimationItemProps {
  children: ReactNode;
  className?: string;
}

export function OnboardingAnimationItem({ children, className }: OnboardingAnimationItemProps) {
  return (
    <UIItem variants={childVariants} className={className}>
      {children}
    </UIItem>
  );
}

const UIItem = styled(motion.div)`
  will-change: transform, opacity, filter;
`;
