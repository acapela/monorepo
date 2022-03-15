import { ActionData, resolveActionDataWithTarget } from "@aca/desktop/actions/action";
import { observer } from "mobx-react";
import React from "react";

import { runActionWithTarget } from "../runAction";
import { SystemMenuItem } from "./SystemMenuItem";

interface Props {
  path: string[];
  action: ActionData;
  isChecked?: boolean;
  target?: unknown;
}

export const ActionSystemMenuItem = observer(function ActionSystemMenuItem({ path, action, target, isChecked }: Props) {
  const { isApplicable, name, shortcut } = resolveActionDataWithTarget(action, target);

  return (
    <SystemMenuItem
      label={name}
      shortcut={shortcut}
      path={path}
      isChecked={isChecked}
      isDisabled={!isApplicable}
      onClicked={() => {
        runActionWithTarget(action, target);
      }}
    />
  );
});
