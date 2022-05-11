import { observer } from "mobx-react";
import React from "react";

import { ActionData, resolveActionDataWithTarget } from "@aca/desktop/actions/action";
import { resolveGroupDataWithTarget } from "@aca/desktop/actions/action/group";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";

import { runActionWithTarget } from "../runAction";
import { SystemMenuItem } from "./SystemMenuItem";

interface Props {
  path: string[];
  group?: string;
  action: ActionData;
  isChecked?: boolean;
  target?: unknown;
  customShortcut?: ShortcutDefinition;
}

export const ActionSystemMenuItem = observer(function ActionSystemMenuItem({
  path,
  action,
  target,
  group,
  isChecked,
  customShortcut,
}: Props) {
  const { isApplicable, name, shortcut, group: actionDataGroup } = resolveActionDataWithTarget(action, target);

  let groupLabel = group;

  if (!groupLabel) {
    const groupNameFromAction = actionDataGroup ? resolveGroupDataWithTarget(actionDataGroup, target).name : undefined;

    if (groupNameFromAction) {
      groupLabel = groupNameFromAction;
    }
  }

  return (
    <SystemMenuItem
      label={name}
      shortcut={customShortcut ?? shortcut}
      group={groupLabel}
      path={path}
      isChecked={isChecked}
      isDisabled={!isApplicable}
      onClicked={() => {
        runActionWithTarget(action, target);
      }}
    />
  );
});
