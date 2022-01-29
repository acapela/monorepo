import React from "react";

import { ActionData, resolveActionData, runAction } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { styledObserver } from "@aca/shared/component";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { describeShortcut } from "@aca/ui/keyboard/describeShortcut";

interface Props {
  action: ActionData;
  target?: unknown;
}

export const ActionIconButton = styledObserver(function ActionIconButton({ action, target }: Props) {
  const context = createActionContext(target);
  const { icon, canApply, shortcut } = resolveActionData(action, context);

  const isDisabled = !canApply(context);

  return (
    <IconButton
      icon={icon}
      isDisabled={isDisabled}
      tooltip={shortcut && !isDisabled ? describeShortcut(shortcut) : undefined}
      onClick={() => {
        runAction(action, context);
      }}
    />
  );
})``;
