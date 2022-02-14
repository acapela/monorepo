import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { ActionContext } from "@aca/desktop/actions/action/context";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { ShortcutDescriptor } from "@aca/ui/keyboard/ShortcutLabel";
import { theme } from "@aca/ui/theme";

interface Props {
  action: ActionData;
  context: ActionContext;
}

export const FooterShortcutLabel = observer(function FooterShortcutLabel({ action, context }: Props) {
  const { name, shortcut, canApply } = resolveActionData(action, context);

  const isEnabled = canApply(context);

  return (
    <UIHolder action={action} target={context.forcedTarget} $isEnabled={isEnabled}>
      <UIName>{name}</UIName>
      {shortcut && <UIShortcut shortcut={shortcut} />}
    </UIHolder>
  );
});

const UIHolder = styled(ActionTrigger)<{ $isEnabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  ${theme.box.label};
  ${theme.radius.button};
  ${theme.transitions.hover("all")};

  ${theme.colors.layout.background.interactive};

  ${(props) =>
    !props.$isEnabled &&
    css`
      opacity: 0.2;
    `}

  &:hover,
  &:active {
    & ${() => UIShortcut} {
      background: none;
    }
  }
`;

const UIName = styled.div`
  ${theme.typo.content.medium};
  white-space: nowrap;
`;

const UIShortcut = styled(ShortcutDescriptor)`
  ${theme.colors.layout.backgroundAccent.asBg};
  padding: 3px;
  ${theme.transitions.hover("all")};
  ${theme.radius.badge};
  ${theme.typo.label.medium};
`;
