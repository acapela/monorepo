import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { ActionContext } from "@aca/desktop/actions/action/context";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { useElementHasOverflow } from "@aca/shared/hooks/useElementHasOverflow";
import { ShortcutDescriptor } from "@aca/ui/keyboard/ShortcutLabel";
import { theme } from "@aca/ui/theme";

interface Props {
  action: ActionData;
  context: ActionContext;
}

export const FooterShortcutLabel = observer(function FooterShortcutLabel({ action, context }: Props) {
  const { name, shortcut, canApply } = resolveActionData(action, context);
  const nameRef = useRef<HTMLDivElement>(null);

  // If we're truncating names, show tooltips
  const shouldShowTooltip = useElementHasOverflow(nameRef);

  const isEnabled = canApply(context);

  return (
    <UIHolder
      action={action}
      data-tooltip={shouldShowTooltip ? name : undefined}
      target={context.forcedTarget}
      $isEnabled={isEnabled}
    >
      <UIName ref={nameRef}>{name}</UIName>
      {shortcut && <UIShortcut shortcut={shortcut} />}
    </UIHolder>
  );
});

const UIHolder = styled(ActionTrigger)<{ $isEnabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  ${theme.box.hint};
  ${theme.radius.button};
  ${theme.transitions.hover("all")};

  ${theme.colors.layout.backgroundAccent.interactive};

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
  ${theme.typo.action.regular.medium};
  white-space: nowrap;
  ${theme.common.ellipsisText};
`;

export const UIShortcut = styled(ShortcutDescriptor)`
  ${theme.colors.layout.backgroundAccent.asBg};
  padding: 3px;
  ${theme.transitions.hover("all")};
  ${theme.radius.badge};
  ${theme.typo.action.regular.medium};
`;
