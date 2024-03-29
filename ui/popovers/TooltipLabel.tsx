import React, { ReactNode, RefObject } from "react";
import styled from "styled-components";

import { POP_PRESENCE_STYLES } from "@aca/ui/animations";
import { Shortcut } from "@aca/ui/keyboard/Shortcut";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";
import { zIndexValues } from "@aca/ui/theme/zIndex";

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
        <UITooltip presenceStyles={POP_PRESENCE_STYLES} transition={{ duration: 0.2 }}>
          {label}
          {shortcut && <UIShortcut shortcut={shortcut} />}
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
  ${theme.typo.noteTitle};
  ${theme.colors.panels.tooltip.asBgWithReadableText};
  ${theme.box.panel.tooltip.padding.radius};
  ${theme.radius.secondaryItem};
  ${theme.shadow.item};
  ${theme.spacing.actions.asGap}
  border: 1px solid ${theme.colors.layout.divider.value};
  pointer-events: none;
  max-width: 300px;
  display: flex;
  align-items: center;
  text-align: center;
`;

const UIShortcut = styled(Shortcut)`
  ${theme.colors.panels.tooltip.hover.asBgWithReadableText};
  ${theme.radius.badge};
  padding: 3px 6px;
`;
