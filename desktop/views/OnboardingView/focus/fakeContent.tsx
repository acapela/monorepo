import { Transition, Variants, motion } from "framer-motion";
import React, { CSSProperties, PropsWithChildren, ReactNode, useState } from "react";
import styled from "styled-components";

import { getRandomInt } from "@aca/shared/numbers";

/**
 * Set of utils for creating dummy, mock-like, fake app window
 * eg. fake avatar, message, paragraph, menu, etc.
 */

const springTransition: Transition = {
  // duration: 1,
  type: "spring",
  stiffness: 150,
  damping: 30,
  mass: 3,
};

const exitTransition: Transition = {
  duration: 0.2,
};

const STAGGER = 1 / 20;

const Y_OFFSET = -10;

/**
 * All parts of fake app will have staggered animation so items appear from top to bottom
 */
const containerVariants: Variants = {
  initial: {
    transition: {
      // when: "beforeChildren",
      staggerChildren: STAGGER,
      ...springTransition,
    },
  },
  enter: {
    transition: {
      // when: "beforeChildren",
      staggerChildren: STAGGER,
      ...springTransition,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      // when: "afterChildren",
      staggerChildren: STAGGER,
      ...exitTransition,
    },
  },
};

const childVariants: Variants = {
  initial: {
    y: Y_OFFSET,
    opacity: 0,
    transition: { ...springTransition, staggerChildren: STAGGER },
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: { ...springTransition, staggerChildren: STAGGER },
  },
  exit: {
    // scale: 0.95,
    // filter: `blur(10px)`,
    transition: { ...exitTransition },
  },
};

export function FakeContentAnimationsOrchestrator({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <UIHolder className={className} variants={containerVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </UIHolder>
  );
}

const UIHolder = styled(motion.div)`
  will-change: transform, opacity;
`;

interface OnboardingAnimationItemProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function useRandomInt(from: number, to: number) {
  const [random] = useState(() => getRandomInt(from, to));

  return random;
}

export function FakeContentItem({ children, className, style }: OnboardingAnimationItemProps) {
  return (
    <UIItem variants={childVariants} className={className} style={style}>
      {children}
    </UIItem>
  );
}

const fakeContentColor = "#8888";

const UIItem = styled(motion.div)`
  will-change: transform, opacity, filter;
`;

interface FakeLabelProps {
  min?: number;
  max?: number;
  usePercent?: boolean;
}

export function FakeLabel({ min = 4, max = 12, usePercent }: FakeLabelProps) {
  const length = useRandomInt(min, max);
  const unit = usePercent ? "%" : "ch";
  return <UILabel $length={length} style={{ width: `${length}${unit}` }} />;
}

const UILabel = styled(FakeContentItem)<{ $length?: number }>`
  height: 0.7em;
  width: 100%;
  background-color: ${fakeContentColor};
  border-radius: 3px;
`;

export function FakeParagraph({ lines }: { lines: number }) {
  return (
    <UIParagraph>
      {Array.from({ length: lines }).map((_, index) => {
        return <FakeLabel key={index} min={40} max={100} usePercent />;
      })}
    </UIParagraph>
  );
}

const UIParagraph = styled(FakeContentItem)`
  display: flex;
  flex-direction: column;
  gap: 0.7em;
`;

export function FakeAvatar() {
  return (
    <FakeContentItem>
      <UIAvatar />
    </FakeContentItem>
  );
}

const UIAvatar = styled.div`
  height: 1.5em;
  width: 1.5em;
  border-radius: 100px;
  background-color: ${fakeContentColor};
`;

export function FakeUser() {
  return (
    <UIUser>
      <FakeAvatar />
      <FakeLabel />
    </UIUser>
  );
}

const UIUser = styled(FakeContentItem)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export function FakeMessage({ lines = 3 }: { lines?: number }) {
  return (
    <UIMessage>
      <FakeUser />
      <FakeParagraph lines={lines} />
    </UIMessage>
  );
}

const UIMessage = styled(FakeContentItem)`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

export function FakeMenu({ count }: { count: number }) {
  return (
    <UIMenu>
      {Array.from({ length: count }).map((_, index) => {
        return <FakeLabel key={index} />;
      })}
    </UIMenu>
  );
}

const UIMenu = styled(FakeContentItem)`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export function FakeUserList({ count }: { count: number }) {
  return (
    <UIUserList>
      {Array.from({ length: count }).map((_, index) => {
        return <FakeUser key={index} />;
      })}
    </UIUserList>
  );
}

const UIUserList = styled(FakeContentItem)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
