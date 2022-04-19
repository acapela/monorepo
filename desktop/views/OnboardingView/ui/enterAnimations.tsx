import { Transition, Variants, motion } from "framer-motion";
import React, { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

const springTransition: Transition = {
  // duration: 1,
  type: "spring",
  stiffness: 150,
  damping: 60,
  mass: 3,
};

const exitTransition: Transition = {
  duration: 0.2,
};

const STAGGER = 0.066;

const Y_OFFSET = -20;

const containerVariants: Variants = {
  initial: {
    transition: {
      when: "beforeChildren",
      staggerChildren: STAGGER,
      ...springTransition,
    },
  },
  enter: {
    transition: {
      when: "beforeChildren",
      staggerChildren: STAGGER,
      ...springTransition,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      // when: "afterChildren",
      // staggerChildren: STAGGER,
      ...exitTransition,
    },
  },
};

const childVariants: Variants = {
  initial: {
    y: Y_OFFSET,
    opacity: 0,
    transition: { ...springTransition, staggerChildren: STAGGER / 2 },
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: { ...springTransition, staggerChildren: STAGGER / 2 },
  },
  exit: {
    // scale: 0.95,
    // filter: `blur(10px)`,
    transition: { ...exitTransition },
  },
};

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
