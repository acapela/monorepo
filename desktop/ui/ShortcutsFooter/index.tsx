import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { ActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { showCommandMenu } from "@aca/desktop/actions/app";
import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { theme } from "@aca/ui/theme";

import { FooterShortcutLabel } from "./ShortcutLabel";

interface Props {
  actions: ActionData[];
  target?: unknown;
}

export const ShortcutsFooter = observer(function ShortcutsFooter({ actions, target }: Props) {
  if (!applicationWideSettingsBridge.get().showShortcutsBar) {
    return null;
  }

  const context = createActionContext(target, { isContextual: true });

  const applicableActions = actions.filter((action) => {
    return action.canApply(context);
  });
  return (
    <UIHolder>
      {applicableActions.map((action) => {
        return <FooterShortcutLabel action={action} context={context} key={action.id} />;
      })}
      <FooterShortcutLabel action={showCommandMenu} context={context} key={showCommandMenu.id} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  border-top: 1px solid ${theme.colors.layout.divider.value};
  ${theme.colors.layout.background.asBg};
  padding: 4px 12px;
`;
