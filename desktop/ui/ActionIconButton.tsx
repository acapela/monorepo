import React from "react";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { runAction } from "@aca/desktop/domains/runAction";
import { styledObserver } from "@aca/shared/component";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { ButtonKind, ButtonSize } from "@aca/ui/buttons/variants";
import { describeShortcut } from "@aca/ui/keyboard/describeShortcut";

import { SharedActionButtonProps } from "./actionShared";

interface Props extends SharedActionButtonProps {
  action: ActionData;
  target?: unknown;
  hideShortcutTooltip?: boolean;
  showTitleInTooltip?: boolean;
  kind?: ButtonKind;
  size?: ButtonSize;
  className?: string;
}

export const ActionIconButton = styledObserver(function ActionIconButton({
  action,
  target,
  hideShortcutTooltip = false,
  showTitleInTooltip = false,
  kind,
  size,
  className,
  notApplicableMode = "disable",
}: Props) {
  const context = createActionContext(target);
  const { icon, canApply, shortcut, name } = resolveActionData(action, context);

  const isApplicable = canApply(context);

  function getTooltip() {
    const parts: string[] = [];

    if (showTitleInTooltip) parts.push(name);

    if (!hideShortcutTooltip && shortcut && !isApplicable) {
      if (showTitleInTooltip) {
        parts.push(`(${describeShortcut(shortcut)})`);
      } else {
        parts.push(describeShortcut(shortcut));
      }
    }

    if (parts.length === 0) return undefined;

    return parts.join(" ");
  }

  if (!isApplicable && notApplicableMode === "hide") return null;

  const isDisabled = notApplicableMode === "disable" && !isApplicable;

  return (
    <IconButton
      className={className}
      kind={kind}
      size={size}
      icon={icon}
      isDisabled={isDisabled}
      tooltip={getTooltip()}
      onClick={() => {
        runAction(action, context);
      }}
    />
  );
})``;
