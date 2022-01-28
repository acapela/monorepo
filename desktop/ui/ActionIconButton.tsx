import React from "react";

import { ActionData, resolveActionData, runAction } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { styledObserver } from "@aca/shared/component";
import { IconButton } from "@aca/ui/buttons/IconButton";

interface Props {
  action: ActionData;
  target?: unknown;
}

export const ActionIconButton = styledObserver(function ActionIconButton({ action, target }: Props) {
  const context = createActionContext(target);
  const { icon, canApply } = resolveActionData(action, context);

  const isDisabled = !canApply(context);

  return (
    <IconButton
      icon={icon}
      isDisabled={isDisabled}
      onClick={() => {
        runAction(action, context);
      }}
    />
  );
})``;
