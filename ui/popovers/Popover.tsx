import { Placement } from "@popperjs/core";
import { throttle } from "lodash";
import React, { ReactNode, RefObject, useState } from "react";
import { usePopper } from "react-popper";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { useRefValue } from "@aca/shared/hooks/useRefValue";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";
import { useValueRef } from "@aca/shared/hooks/useValueRef";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { ScreenCover } from "@aca/ui/Modal/ScreenCover";
import { theme } from "@aca/ui/theme";

export type PopoverPlacement = Placement;

interface PopoverProps {
  anchorRef: RefObject<HTMLElement>;
  children: ReactNode;
  isDisabled?: boolean;
  className?: string;
  placement?: PopoverPlacement;
  distance?: number;
  onClickOutside?: () => void;
  enableScreenCover?: boolean;
}

export const Popover = styled<PopoverProps>(
  ({
    className,
    anchorRef,
    children,
    isDisabled,
    onClickOutside,
    distance = 5,
    placement = "auto",
    enableScreenCover = false,
  }) => {
    const anchorElement = useRefValue(anchorRef);

    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

    const { styles, attributes, update } = usePopper(anchorElement, popperElement, {
      placement,
      strategy: "fixed",

      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, distance],
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

    useClickAway(poperRef, () => {
      onClickOutside?.();
    });

    useResizeCallback(poperRef, () => {
      throttledUpdate?.();
    });

    useShortcut("Esc", () => {
      onClickOutside?.();
    });

    if (isDisabled) return null;

    const popoverNode = (
      <UIHolder className={className} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        {children}
      </UIHolder>
    );

    if (!enableScreenCover) {
      return <BodyPortal>{popoverNode}</BodyPortal>;
    }

    // Screen cover is already body portal by itself
    return <ScreenCover>{popoverNode}</ScreenCover>;
  }
)``;

const UIHolder = styled.div<{}>`
  position: fixed;
  position: relative;
  will-change: transform;
  /* TODO PR: add z-index automatically */
  z-index: ${theme.zIndex.popover};
`;
