import React, { ReactNode, RefObject } from "react";
import styled from "styled-components";

import { POP_PRESENCE_STYLES } from "~ui/animations";
import { Shortcut } from "~ui/keyboard/Shortcut";
import { ShortcutDefinition } from "~ui/keyboard/shortcutBase";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { theme } from "~ui/theme";
import { zIndexValues } from "~ui/theme/zIndex";

import { Popover, PopoverPlacement } from "./Popover";

export interface TooltipLabelProps {
  anchorRef: RefObject<HTMLElement>;
  label: ReactNode;
  shortcut?: ShortcutDefinition;
  isDisabled?: boolean;
  placement?: PopoverPlacement;
}

export const TooltipLabel = styled<TooltipLabelProps>(
  ({ anchorRef, label, isDisabled, shortcut, placement = "top" }) => {
    return (
      <TooltipFlyer anchorRef={anchorRef} isDisabled={isDisabled} placement={placement}>
        <UITooltip presenceStyles={POP_PRESENCE_STYLES}>
          {label}
          {shortcut && <Shortcut shortcut={shortcut} />}
        </UITooltip>
      </TooltipFlyer>
    );
  }
)``;

const TooltipFlyer = styled(Popover)`
  z-index: ${zIndexValues.tooltip};
  pointer-events: none;
`;

const UITooltip = styled(PresenceAnimator)<{}>`
  ${theme.typo.functional.tooltip};
  ${theme.colors.panels.tooltip.asBgWithReadableText};
  ${theme.box.item};
  ${theme.radius.secondaryItem};
  ${theme.spacing.actions.asGap}
  pointer-events: none;
  max-width: 300px;
  display: flex;
  align-items: center;
`;
