import React, { ReactNode, RefObject } from "react";
import { useClickAway } from "react-use";
import styled, { css } from "styled-components";
import { ScreenCover } from "~frontend/src/ui/Modal/ScreenCover";
import { borderRadius, fontSize } from "~ui/baseStyles";
import { BASE_GREY_1, DANGER_COLOR, PRIMARY_PINK_1_TRANSPARENT, PRIMARY_PINK_2 } from "~ui/theme/colors/base";
import { hoverTransition } from "~ui/transitions";
import { UIDropdownPanelBody } from "./DropdownPanelBody";
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
  onSelect?: () => void;
}

export const PopoverMenu = styled(
  ({ options, placement = "bottom-start", className, anchorRef, onCloseRequest, onItemSelected }: Props) => {
    useClickAway(anchorRef, () => onCloseRequest?.());

    return (
      <ScreenCover onCloseRequest={onCloseRequest}>
        <Popover anchorRef={anchorRef} placement={placement}>
          <UIPopoverMenuModal className={className} onClick={(event) => event.stopPropagation()}>
            {options.map((option) => {
              return (
                <UIMenuItem
                  isDestructive={option.isDestructive ?? false}
                  isDisabled={option.isDisabled ?? false}
                  isClickable={!!option.onSelect}
                  key={option.key ?? option.label}
                  onClick={() => {
                    onItemSelected?.(option);
                    onCloseRequest?.();
                    option.onSelect?.();
                  }}
                >
                  {option.icon && <UIItemIcon>{option.icon}</UIItemIcon>}
                  {option.label}
                </UIMenuItem>
              );
            })}
          </UIPopoverMenuModal>
        </Popover>
      </ScreenCover>
    );
  }
)``;

export const UIPopoverMenuModal = styled(UIDropdownPanelBody)`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 200px;
`;

const UIMenuItem = styled.li<{ isDestructive: boolean; isDisabled: boolean; isClickable: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 8px;

  font-size: ${fontSize.label};
  line-height: 1.5em;
  border: 1px solid transparent;

  ${(props) =>
    props.isClickable &&
    css<{}>`
      cursor: pointer;
      ${hoverTransition()};
      &:hover {
        border-color: ${PRIMARY_PINK_2};
        background: ${PRIMARY_PINK_1_TRANSPARENT};
      }
    `}

  ${(props) =>
    props.isDisabled &&
    css<{}>`
      opacity: 0.3;
      pointer-events: none;
    `}

  color: ${(props) => (props.isDestructive ? DANGER_COLOR : BASE_GREY_1)};

  ${borderRadius.item}
`;

const UIItemIcon = styled.div<{}>`
  font-size: 1.5em;
  margin-right: 12px;
`;
