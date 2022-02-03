import React from "react";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { styledObserver } from "@aca/shared/component";
import { Button, ButtonStyleProps } from "@aca/ui/buttons/Button";

import { runAction } from "../domains/runAction";
import { SharedActionButtonProps } from "./actionShared";

interface Props extends ButtonStyleProps, SharedActionButtonProps {
  action: ActionData;
  target?: unknown;
}

export const ActionButton = styledObserver(function ActionButton({ action, target }: Props) {
  const context = createActionContext(target);
  const { name, icon } = resolveActionData(action, context);

  const canApply = action.canApply(context);

  return (
    <Button
      icon={icon}
      isDisabled={!canApply}
      onClick={() => {
        runAction(action, context);
      }}
    >
      {name}
    </Button>
  );
})``;
