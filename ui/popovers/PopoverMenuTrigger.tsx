import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { useBoolean } from "~shared/hooks/useBoolean";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { zIndex } from "~ui/zIndex";
import { PopoverPlacement } from "./Popover";
import { PopoverMenu, PopoverMenuOption } from "./PopoverMenu";

type NonEmptyArray<T> = [T, ...T[]];

interface Props {
  className?: string;
  children: ReactNode;
  options: NonEmptyArray<PopoverMenuOption>;
  placement?: PopoverPlacement;
  onOpen?: () => void;
  onClose?: () => void;
  tooltip?: string;
}

export const PopoverMenuTrigger = styled(
  ({ children: triggerElement, options, placement = "bottom-start", className, onOpen, onClose, tooltip }: Props) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [isOpen, { unset: closePopover, toggle: togglePopover }] = useBoolean(false);

    useClickAway(anchorRef, closePopover);

    useDependencyChangeEffect(() => {
      isOpen ? onOpen?.() : onClose?.();
    }, [isOpen]);

    return (
      <>
        <UIHolder
          data-tooltip={tooltip && !isOpen && tooltip}
          ref={anchorRef}
          onClick={togglePopover}
          className={className}
        >
          {triggerElement}
        </UIHolder>
        <AnimatePresence>
          {isOpen && (
            <PopoverMenu placement={placement} options={options} anchorRef={anchorRef} onCloseRequest={closePopover} />
          )}
        </AnimatePresence>
      </>
    );
  }
)``;

const UIHolder = styled.div`
  z-index: ${zIndex.Popover};
`;
