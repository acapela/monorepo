import assert from "assert";

import React, { ReactNode, RefObject, useRef } from "react";
import { useIsomorphicLayoutEffect, useScroll } from "react-use";
import styled, { css } from "styled-components";

import { useEqualState } from "@aca/shared/hooks/useEqualState";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";

import { PopPresenceAnimator } from "./animations";
import { IconButton } from "./buttons/IconButton";
import { IconArrowLeft, IconArrowRight } from "./icons";
import { theme } from "./theme";

interface Props {
  children: ReactNode;
  className?: string;
}

interface ScrollProps {
  availableHorizontalSpace: number;
  totalHorizontalScrollWidth: number;
  maxXPosition: number;
}

function getScrollProps(el: HTMLElement): ScrollProps {
  const availableHorizontalSpace = el.offsetWidth;

  const totalHorizontalScrollWidth = el.scrollWidth;

  /*
    Example of a scroll position placed completely to the right (max x position)
    
    0000|---XXX|
    
    The "0" would represent the left over horizontal scroll width that's currently hidden
    "X" is the scroll thumb
    The places between "|" represent the "availableHorizontalSpace"
    We count the "0"s plus the places between "|" as the "totalHorizontalScrollWidth"

    In this example:
    availableHorizontalSpace = 3* "-" + 3* "X" (6 total)
    totalHorizontalScrollWidth = 4* "0" + availableHorizontalSpace (10 total)
    maxXPosition = 10 - 6 (total is 4)
  */
  const maxXPosition = totalHorizontalScrollWidth - availableHorizontalSpace;

  return {
    availableHorizontalSpace,
    totalHorizontalScrollWidth,
    maxXPosition,
  };
}

function useScrollProps(ref: RefObject<HTMLElement>) {
  const [props, setProps] = useEqualState<null | ScrollProps>(null);
  const scroll = useScroll(ref);

  function updateProps() {
    if (!ref.current) {
      return;
    }

    const newProps = getScrollProps(ref.current);

    setProps(newProps);
  }

  useResizeCallback(ref, updateProps);

  useIsomorphicLayoutEffect(updateProps);

  return {
    scrollXPosition: scroll.x,
    scrollYPosition: scroll.y,
    ...props,
  };
}

export const HorizontalScroller = styled(function HorizontalScroller({ className, children }: Props) {
  const listTabRef = useRef<null | HTMLDivElement>(null);
  const { scrollXPosition, availableHorizontalSpace, maxXPosition } = useScrollProps(listTabRef);

  function scrollRight() {
    assert(availableHorizontalSpace);
    assert(maxXPosition);

    const potentialNextXOffset = scrollXPosition + availableHorizontalSpace;
    const nextXPosition = potentialNextXOffset > maxXPosition ? maxXPosition : potentialNextXOffset;

    listTabRef.current?.scrollTo({ left: nextXPosition });
  }

  function scrollLeft() {
    assert(availableHorizontalSpace);
    assert(maxXPosition);

    const potentialNextXOffset = scrollXPosition - availableHorizontalSpace;

    const nextXPosition = potentialNextXOffset < 0 ? 0 : potentialNextXOffset;

    listTabRef.current?.scrollTo({ left: nextXPosition });
  }

  const canScrollRight = !!maxXPosition && scrollXPosition < maxXPosition;
  const canScrollLeft = scrollXPosition !== 0;

  return (
    <UIHolder className={className}>
      <UIScrollHolder ref={listTabRef}>{children}</UIScrollHolder>
      {canScrollLeft && (
        <UIFlyingPresence $position="left">
          <IconButton kind="secondary" icon={<IconArrowLeft />} onClick={scrollLeft} />
        </UIFlyingPresence>
      )}
      {canScrollRight && (
        <UIFlyingPresence $position="right">
          <IconButton kind="secondary" icon={<IconArrowRight />} onClick={scrollRight} />
        </UIFlyingPresence>
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  position: relative;
`;

const UIScrollHolder = styled.div`
  &::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    height: 0;
  }

  overflow-x: auto;
  overflow-y: hidden;

  scroll-behavior: smooth;
`;

const UIFlyingPresence = styled(PopPresenceAnimator)<{ $position: "left" | "right" }>`
  position: absolute;
  ${theme.shadow.item}
  top: 0;
  z-index: 5;

  ${(props) =>
    props.$position === "left"
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
`;
