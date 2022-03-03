import React from "react";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { runAction } from "@aca/desktop/domains/runAction";
import { styledObserver } from "@aca/shared/component";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { ButtonKind, ButtonSize } from "@aca/ui/buttons/variants";
import { describeShortcut } from "@aca/ui/keyboard/describeShortcut";

interface Props {
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
}: Props) {
  const context = createActionContext(target);
  const { icon, canApply, shortcut, name } = resolveActionData(action, context);

  const isDisabled = !canApply(context);

  function getTooltip() {
    const parts: string[] = [];

    if (showTitleInTooltip) parts.push(name);

    if (!hideShortcutTooltip && shortcut && !isDisabled) {
      if (showTitleInTooltip) {
        parts.push(`(${describeShortcut(shortcut)})`);
      } else {
        parts.push(describeShortcut(shortcut));
      }
    }

    if (parts.length === 0) return undefined;

    return parts.join(" ");
  }

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
