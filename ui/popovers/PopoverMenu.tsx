import { runInAction } from "mobx";
import React, { ReactNode, RefObject, useRef } from "react";
import { useClickAway } from "react-use";
import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

import { UIDropdownPanelBody } from "./DropdownPanelBody";
import { Popover, PopoverPlacement } from "./Popover";

function openInNewTab(href: string) {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    href: href,
  }).click();
}

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
      <Popover
        anchorRef={anchorRef}
        placement={placement}
        isDisabled={isDisabled}
        enableScreenCover
        onCloseRequest={onCloseRequest}
      >
        <UIPopoverMenuModal ref={popoverRef} className={className} onClick={(event) => event.stopPropagation()}>
          {options.map((option) => {
            const labelInnerNode = (
              <>
                {option.icon && <UIItemIcon>{option.icon}</UIItemIcon>}
                {option.label}
              </>
            );

            const labelNode = (
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
                {labelInnerNode}
              </UIMenuItem>
            );

            if ("href" in option) {
              return (
                <a key={option.key ?? option.label} href={option.href}>
                  <a>{labelNode}</a>
                </a>
              );
            }

            return labelNode;
          })}
        </UIPopoverMenuModal>
      </Popover>
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

  ${theme.typo.bodyTitle.readingLineHeight};
  ${theme.transitions.hover()};
  ${theme.box.items.selectItem.padding.size.radius};

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
  ${theme.iconSize.item};
  margin-right: 12px;
`;
