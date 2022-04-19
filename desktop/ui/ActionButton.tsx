import React from "react";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { useActionContext } from "@aca/desktop/actions/action/context";
import { runAction } from "@aca/desktop/domains/runAction";
import { styledObserver } from "@aca/shared/component";
import { Button, ButtonProps } from "@aca/ui/buttons/Button";
import { ButtonSize } from "@aca/ui/buttons/variants";

import { SharedActionButtonProps } from "./actionShared";

interface Props extends Omit<ButtonProps, "icon">, SharedActionButtonProps {
  action: ActionData;
  target?: unknown;
  size?: ButtonSize;
  notApplicableLabel?: string;
}

export const ActionButton = styledObserver(function ActionButton({
  action,
  size,
  target,
  notApplicableMode,
  notApplicableLabel,
  ...buttonProps
}: Props) {
  const context = useActionContext(target, { isContextual: true });
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
      size={size}
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
