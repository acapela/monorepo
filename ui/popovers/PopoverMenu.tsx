import React, { ReactNode, useRef } from "react";
import { zIndex } from "~ui/zIndex";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useClickAway } from "react-use";
import { useBoolean } from "~frontend/src/hooks/useBoolean";
import { Popover, PopoverPlacement } from "./Popover";
import { hoverActionCss } from "~ui/transitions";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { DANGER_COLOR } from "~ui/colors";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { Tooltip } from "./Tooltip";

type NonEmptyArray<T> = [T, ...T[]];

interface Props {
  className?: string;
  children: ReactNode;
  options: NonEmptyArray<PopoverMenuOptions>;
  position?: PopoverPlacement;
  onOpen?: () => void;
  onClose?: () => void;
  tooltip?: string;
}

export interface PopoverMenuOptions {
  label: string;
  icon?: ReactNode;
  isDisabled?: boolean;
  isDestructive?: boolean;
  onSelect: () => void;
}

export const PopoverMenu = styled(
  ({ children: triggerElement, options, position = "bottom-start", className, onOpen, onClose, tooltip }: Props) => {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [isOpen, { unset: closePopover, set: openPopover }] = useBoolean(false);

    useClickAway(anchorRef, closePopover);

    useDependencyChangeEffect(() => {
      if (isOpen) {
        onOpen?.();
        return;
      }

      if (!isOpen) {
        onClose?.();
        return;
      }
    }, [isOpen]);

    return (
      <>
        {tooltip && !isOpen && <Tooltip anchorRef={anchorRef} label={tooltip} />}
        <UIHolder ref={anchorRef} onClick={openPopover} className={className}>
          {triggerElement}
          <AnimatePresence>
            {isOpen && (
              <Popover anchorRef={anchorRef} placement={position}>
                <UIMenu
                  presenceStyles={{ opacity: [0, 1], scale: [0.95, 1] }}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                >
                  {options.map(({ label, onSelect, icon, isDestructive = false }) => (
                    <UIMenuItem
                      isDestructive={isDestructive}
                      key={label}
                      onClick={() => {
                        closePopover();
                        onSelect();
                      }}
                    >
                      {icon && <UIItemIcon>{icon}</UIItemIcon>}
                      {label}
                    </UIMenuItem>
                  ))}
                </UIMenu>
              </Popover>
            )}
          </AnimatePresence>
        </UIHolder>
      </>
    );
  }
)``;

const UIHolder = styled.div`
  z-index: ${zIndex.Popover};
`;

const UIMenu = styled(PresenceAnimator)`
  padding: 9.5px;

  background: #ffffff;
  border: 1px solid #e0e3e7;
  box-sizing: border-box;
  box-shadow: 0px 8px 40px rgba(147, 158, 170, 0.2);
  border-radius: 6px;
  min-width: 200px;
`;

const UIMenuItem = styled.li<{ isDestructive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;

  font-size: 14px;
  line-height: 2em;

  ${hoverActionCss}

  color: ${(props) => (props.isDestructive ? DANGER_COLOR : "#232b35")};

  border-radius: 3px;
`;

const UIItemIcon = styled.div`
  font-size: 1.5em;
  margin-right: 12px;
`;
