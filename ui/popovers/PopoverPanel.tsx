import { Placement } from "@popperjs/core";
import React from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { PopPresenceAnimator } from "../animations";
import { Popover, PopoverProps } from "./Popover";

export type PopoverPlacement = Placement;

export const PopoverPanel = styled<PopoverProps>((props) => {
  const { children, className, ...popoverProps } = props;
  return (
    <Popover {...popoverProps}>
      <UIDropdownPanelBody className={className}>{children}</UIDropdownPanelBody>
    </Popover>
  );
})``;

export const UIDropdownPanelBody = styled(PopPresenceAnimator)<{}>`
  ${theme.box.panel.primaryPopover.padding.radius}
  display: flex;
  flex-direction: column;
  ${theme.colors.layout.background.withBorder.asBgWithReadableText};
  box-sizing: border-box;
  ${theme.shadow.popover};
  min-width: 240px;
`;
