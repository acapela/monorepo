import React, { CSSProperties, ReactNode, RefObject, useEffect, useState } from "react";
import Popper, { usePopper } from "react-popper";
import { Placement } from "@popperjs/core";
import styled from "styled-components";
import { useRefValue } from "~shared/hooks/useRefValue";
import { useResizeCallback } from "~shared/hooks/useResizeCallback";
import { BodyPortal } from "~ui/BodyPortal";
import { zIndex } from "~ui/zIndex";
import { throttle } from "lodash";
import { useValueRef } from "~shared/hooks/useValueRef";

interface PopoverProps {
  anchorRef: RefObject<HTMLElement>;
  children: ReactNode;
  isDisabled?: boolean;
  className?: string;
  placement?: Placement;
}

export const Popover = styled(({ className, anchorRef, children, isDisabled, placement = "auto" }: PopoverProps) => {
  const anchorElement = useRefValue(anchorRef);

  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const { styles, attributes, update } = usePopper(anchorElement, popperElement, {
    placement,
    strategy: "fixed",

    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 5],
        },
      },
      {
        name: "preventOverflow",
        options: {
          padding: 8,
        },
      },
    ],
  });

  const throttledUpdate = throttle(update ?? (() => null), 200);

  const poperRef = useValueRef(popperElement);

  useResizeCallback(poperRef, () => {
    throttledUpdate?.();
  });

  if (isDisabled) return null;

  return (
    <BodyPortal>
      <UIHolder className={className} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        {children}
      </UIHolder>
    </BodyPortal>
  );
})``;

const UIHolder = styled.div`
  position: fixed;
  position: relative;
  will-change: transform;
  z-index: ${zIndex.Popover};
`;
