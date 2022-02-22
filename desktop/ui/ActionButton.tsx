import React from "react";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { runAction } from "@aca/desktop/domains/runAction";
import { styledObserver } from "@aca/shared/component";
import { Button, ButtonProps } from "@aca/ui/buttons/Button";

import { SharedActionButtonProps } from "./actionShared";

interface Props extends Omit<ButtonProps, "icon">, SharedActionButtonProps {
  action: ActionData;
  target?: unknown;
  notApplicableLabel?: string;
}

export const ActionButton = styledObserver(function ActionButton({
  action,
  target,
  notApplicableMode,
  notApplicableLabel,
  ...buttonProps
}: Props) {
  const context = createActionContext(target, { isContextual: true });
  const { name, icon } = resolveActionData(action, context);

  const canApply = action.canApply(context);

  if (notApplicableMode === "hide" && !canApply) {
    return <></>;
  }

  function getLabel() {
    if (canApply) {
      return name;
    }

    if (notApplicableLabel) return notApplicableLabel;

    return name;
  }

  return (
    <Button
      icon={icon}
      isDisabled={!canApply}
      onClick={() => {
        runAction(action, context);
      }}
      {...buttonProps}
    >
      {getLabel()}
    </Button>
  );
})``;
