import { runInAction } from "mobx";
import Link from "next/link";
import React, { ReactNode, RefObject, useRef } from "react";
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
  isDisabled?: boolean;
}

export type PopoverMenuOption = {
  key?: string;
  label: string;
  icon?: ReactNode;
  isDisabled?: boolean;
  isDestructive?: boolean;
} & ({ href: string } | { onSelect: () => void } | { externalURL: string });

export const PopoverMenu = styled<Props>(
  ({ options, placement = "bottom-start", className, anchorRef, isDisabled, onCloseRequest, onItemSelected }) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    useClickAway(popoverRef, () => onCloseRequest?.());

    return (
      <ScreenCover onCloseRequest={onCloseRequest}>
        <Popover anchorRef={anchorRef} placement={placement} isDisabled={isDisabled}>
          <UIPopoverMenuModal ref={popoverRef} className={className} onClick={(event) => event.stopPropagation()}>
            {options.map((option) => {
              const labelNode = (
                <>
                  {option.icon && <UIItemIcon>{option.icon}</UIItemIcon>}
                  {option.label}
                </>
              );
              return (
                <UIMenuItem
                  data-test-id="popover-menu-item"
                  isDestructive={option.isDestructive ?? false}
                  isDisabled={option.isDisabled ?? false}
                  key={option.key ?? option.label}
                  onClick={() => {
                    if ("externalURL" in option) {
                      openInNewTab(option.externalURL);
                    }
                    onItemSelected?.(option);
                    onCloseRequest?.();
                    runInAction(() => {
                      "onSelect" in option && option.onSelect();
                    });
                  }}
                >
                  {"href" in option ? (
                    <Link href={option.href} passHref>
                      <a>{labelNode}</a>
                    </Link>
                  ) : (
                    labelNode
                  )}
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
  display: flex;
  flex-direction: column;
`;

const UIMenuItem = styled.li<{ isDestructive: boolean; isDisabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  ${theme.typo.action.regular.readingLineHeight.medium};
  ${theme.transitions.hover()};
  ${theme.box.selectOption};

  ${theme.colors.panels.popover.interactive}

  border: 1px solid transparent;

  a {
    display: flex;
    align-items: center;
  }

  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}

  color: ${(props) => props.isDestructive && theme.colors.status.danger};
`;

const UIItemIcon = styled.div<{}>`
  font-size: 1.5em;
  margin-right: 12px;
`;
