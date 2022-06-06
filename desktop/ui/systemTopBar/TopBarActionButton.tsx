import React from "react";

import { ActionData } from "@aca/desktop/actions/action";

import { ActionIconButton } from "../ActionIconButton";
import { ActionNotApplicableMode } from "../actionShared";

interface Props {
  action: ActionData;
  target?: unknown;
  notApplicableMode?: ActionNotApplicableMode;
}

export function TopBarActionButton({ action, target, notApplicableMode }: Props) {
  return (
    <ActionIconButton
      notApplicableMode={notApplicableMode}
      showTitleInTooltip
      size="compactWide"
      kind="transparent"
      action={action}
      target={target}
    />
  );
}
