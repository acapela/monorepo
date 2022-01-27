import React from "react";
import styled from "styled-components";

import { ActionData, resolveActionDataWithTarget } from "@aca/desktop/actions/action";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { theme } from "@aca/ui/theme";

interface Props {
  action: ActionData;
  target?: unknown;
}

export function SidebarItem({ action, target }: Props) {
  const { name } = resolveActionDataWithTarget(action, target);
  return (
    <ActionTrigger action={action} target={target}>
      <UIHolder>
        <UILabel>{name}</UILabel>
      </UIHolder>
    </ActionTrigger>
  );
}

const UIHolder = styled.div`
  padding: 12px 12px 12px 72px;
  ${theme.typo.secondaryTitle};
  ${theme.common.clickable};
`;
const UILabel = styled.div``;
