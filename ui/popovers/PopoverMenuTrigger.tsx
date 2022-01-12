import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { theme } from "@aca/ui/theme";

import { PopoverPlacement } from "./Popover";
import { PopoverMenu, PopoverMenuOption } from "./PopoverMenu";

interface Props {
  className?: string;
  children: ReactNode;
  options: Array<PopoverMenuOption>;
  placement?: PopoverPlacement;
  onOpen?: () => void;
  onClose?: () => void;
  tooltip?: string;
  isDisabled?: boolean;
}

export const PopoverMenuTrigger = styled<Props>(
  ({
    children: triggerElement,
    options,
    placement = "bottom-start",
    className,
    onOpen,
    onClose,
    tooltip,
    isDisabled,
  }) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [isOpen, { unset: closePopover, set: openPopover }] = useBoolean(false);

    useDependencyChangeEffect(() => {
      isOpen ? onOpen?.() : onClose?.();
    }, [isOpen]);

    if (isDisabled) {
      return <UIHolder>{triggerElement}</UIHolder>;
    }

    return (
      <>
        <UIHolder
          data-tooltip={tooltip && !isOpen && tooltip}
          ref={anchorRef}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            openPopover();
          }}
          className={className}
        >
          {triggerElement}
        </UIHolder>
        <AnimatePresence>
          {isOpen && (
            <UIPopoverMenu
              placement={placement}
              options={options}
              anchorRef={anchorRef}
              onCloseRequest={closePopover}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
)``;

const UIHolder = styled.div<{}>``;

const UIPopoverMenu = styled(PopoverMenu)<{}>`
  z-index: ${theme.zIndex.popover};
`;
