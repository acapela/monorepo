import React, { ReactNode, RefObject } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";
import { ScreenCover } from "~frontend/src/ui/Modal/ScreenCover";
import { POP_PRESENCE_STYLES } from "~ui/animations";
import { shadow } from "~ui/baseStyles";
import { DANGER_COLOR } from "~ui/colors";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { hoverActionCss } from "~ui/transitions";
import { Popover, PopoverPlacement } from "./Popover";

interface Props {
  className?: string;
  anchorRef: RefObject<HTMLElement>;
  options: PopoverMenuOption[];
  onItemSelected?: (item: PopoverMenuOption) => void;
  placement?: PopoverPlacement;
  onCloseRequest?: () => void;
}

export interface PopoverMenuOption {
  key?: string;
  label: string;
  icon?: ReactNode;
  isDisabled?: boolean;
  isDestructive?: boolean;
  onSelect: () => void;
}

export const PopoverMenu = styled(
  ({ options, placement = "bottom-start", className, anchorRef, onCloseRequest, onItemSelected }: Props) => {
    useClickAway(anchorRef, () => onCloseRequest?.());

    return (
      <ScreenCover onCloseRequest={onCloseRequest}>
        <Popover anchorRef={anchorRef} placement={placement}>
          <UIMenu
            presenceStyles={POP_PRESENCE_STYLES}
            className={className}
            onClick={(event) => event.stopPropagation()}
          >
            {options.map((option) => {
              return (
                <UIMenuItem
                  isDestructive={option.isDestructive ?? false}
                  key={option.key ?? option.label}
                  onClick={() => {
                    onItemSelected?.(option);
                    onCloseRequest?.();
                    option.onSelect();
                  }}
                >
                  {option.icon && <UIItemIcon>{option.icon}</UIItemIcon>}
                  {option.label}
                </UIMenuItem>
              );
            })}
          </UIMenu>
        </Popover>
      </ScreenCover>
    );
  }
)``;

const UIMenu = styled(PresenceAnimator)`
  padding: 9.5px;

  background: #ffffff;
  border: 1px solid #e0e3e7;
  box-sizing: border-box;
  ${shadow.modal};
  border-radius: 6px;
  min-width: 200px;
`;

const UIMenuItem = styled.li<{ isDestructive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;

  font-size: 1rem;
  line-height: 2em;

  ${hoverActionCss}

  color: ${(props) => (props.isDestructive ? DANGER_COLOR : "#232b35")};

  border-radius: 3px;
`;

const UIItemIcon = styled.div`
  font-size: 1.5em;
  margin-right: 12px;
`;
