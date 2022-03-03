import React from "react";

import { ActionData } from "@aca/desktop/actions/action";

import { ActionIconButton } from "../ActionIconButton";

interface Props {
  action: ActionData;
  target?: unknown;
}

export function TopBarActionButton({ action, target }: Props) {
  return <ActionIconButton showTitleInTooltip size="compactWide" kind="transparent" action={action} target={target} />;
}
