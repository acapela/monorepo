import React from "react";

import { ActionData, resolveActionData, runAction } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { styledObserver } from "@aca/shared/component";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { describeShortcut } from "@aca/ui/keyboard/describeShortcut";

interface Props {
  action: ActionData;
  target?: unknown;
  hideShortcutTooltip?: boolean;
}

export const ActionIconButton = styledObserver(function ActionIconButton({
  action,
  target,
  hideShortcutTooltip,
}: Props) {
  const context = createActionContext(target);
  const { icon, canApply, shortcut } = resolveActionData(action, context);

  const isDisabled = !canApply(context);

  return (
    <IconButton
      icon={icon}
      isDisabled={isDisabled}
      tooltip={!hideShortcutTooltip && shortcut && !isDisabled ? describeShortcut(shortcut) : undefined}
      onClick={() => {
        runAction(action, context);
      }}
    />
  );
})``;
