import { runInAction } from "mobx";
import React, { ReactNode, RefObject } from "react";
import { useClickAway } from "react-use";
import styled, { css } from "styled-components";

import { ScreenCover } from "~frontend/src/ui/Modal/ScreenCover";
import { openInNewTab } from "~frontend/src/utils/openInNewTab";
import { theme } from "~ui/theme";

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
  openUrlOnSelect?: string;
}

export const PopoverMenu = styled<Props>(
  ({ options, placement = "bottom-start", className, anchorRef, onCloseRequest, onItemSelected }) => {
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
                  isClickable={!!option.onSelect || !!option.openUrlOnSelect}
                  key={option.key ?? option.label}
                  onClick={() => {
                    option.openUrlOnSelect && openInNewTab(option.openUrlOnSelect);
                    onItemSelected?.(option);
                    onCloseRequest?.();
                    runInAction(() => {
                      option.onSelect?.();
                    });
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

export const UIPopoverMenuModal = styled(UIDropdownPanelBody)<{}>`
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

  ${theme.typo.label.readingLineHeight};
  border: 1px solid transparent;

  ${(props) =>
    props.isClickable &&
    css`
      cursor: pointer;
      ${theme.transitions.hover()};
      &:hover {
        border-color: ${theme.colors.primary.border};
        background: ${theme.colors.primary.opacity(0.05)};
      }
    `}

  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}

  color: ${(props) => (props.isDestructive ? theme.colors.status.danger : theme.colors.text)};

  ${theme.radius.secondaryItem};
`;

const UIItemIcon = styled.div<{}>`
  font-size: 1.5em;
  margin-right: 12px;
`;
