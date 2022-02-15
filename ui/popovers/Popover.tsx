import { Placement } from "@popperjs/core";
import { throttle } from "lodash";
import React, { ReactNode, RefObject, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";

import { useHandleCloseRequest } from "@aca/shared/hooks/useClickOutside";
import { useRefValue } from "@aca/shared/hooks/useRefValue";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";
import { useValueRef } from "@aca/shared/hooks/useValueRef";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";
import { ScreenCover } from "@aca/ui/Modal/ScreenCover";
import { theme } from "@aca/ui/theme";

export type PopoverPlacement = Placement;

export interface PopoverProps {
  anchorRef: RefObject<HTMLElement>;
  children: ReactNode;
  isDisabled?: boolean;
  className?: string;
  placement?: PopoverPlacement;
  distance?: number;
  onCloseRequest?: () => void;
  enableScreenCover?: boolean;
}

export const Popover = styled<PopoverProps>(
  ({
    className,
    anchorRef,
    children,
    isDisabled,
    onCloseRequest,
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

    useHandleCloseRequest(poperRef, () => {
      onCloseRequest?.();
    });

    useResizeCallback(anchorRef, () => {
      throttledUpdate?.();
    });

    useResizeCallback(poperRef, () => {
      throttledUpdate?.();
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
