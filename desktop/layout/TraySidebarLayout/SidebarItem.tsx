import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { ActionData, resolveActionDataWithTarget } from "@aca/desktop/actions/action";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { theme } from "@aca/ui/theme";

interface Props {
  action: ActionData;
  target?: unknown;
}

export const SidebarItem = observer(function SidebarItem({ action, target }: Props) {
  const { name } = resolveActionDataWithTarget(action, target);
  return (
    <UIHolder action={action} target={target}>
      <UILabel>{name}</UILabel>
    </UIHolder>
  );
});

const UIHolder = styled(ActionTrigger)`
  padding: 12px 12px 12px 72px;
  ${theme.typo.secondaryTitle};
  ${theme.common.clickable};
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;
const UILabel = styled.div``;
