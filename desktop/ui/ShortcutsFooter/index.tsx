import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { ActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { theme } from "@aca/ui/theme";

import { FooterShortcutLabel } from "./ShortcutLabel";

interface Props {
  actions: ActionData[];
  target?: unknown;
}

export const ShortcutsFooter = observer(function ShortcutsFooter({ actions, target }: Props) {
  const context = createActionContext(target, { isContextual: true });
  return (
    <UIHolder>
      {actions.map((action) => {
        return <FooterShortcutLabel action={action} context={context} key={action.id} />;
      })}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  border-top: 1px solid ${theme.colors.layout.divider.value};
  padding: 4px 12px;
`;
