import { observer } from "mobx-react";
import React from "react";
import { useRef } from "react";
import styled, { css } from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { useActionContext } from "@aca/desktop/actions/action/context";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { runAction } from "@aca/desktop/domains/runAction";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { Thunk, resolveThunk } from "@aca/shared/thunk";
import { IconFolder, IconRefreshCcwAlert } from "@aca/ui/icons";
import { Shortcut } from "@aca/ui/keyboard/Shortcut";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";
import { theme } from "@aca/ui/theme";

interface Props {
  action: ActionData;
  target?: unknown;
  className?: string;
  isActive?: boolean;
  requiresReconnection?: boolean;
  badgeCount?: Thunk<number | undefined>;
  additionalShortcut?: ShortcutDefinition;
  contextMenuActions?: ActionData[];
}

export const SidebarItem = observer(function SidebarItem({
  action,
  target,
  className,
  isActive = false,
  requiresReconnection = false,
  badgeCount,
  additionalShortcut,
  contextMenuActions = [],
}: Props) {
  const context = useActionContext(target, { isContextual: true });
  const { name, icon = <IconFolder /> } = resolveActionData(action, context);
  const elementRef = useRef<HTMLDivElement>(null);

  useActionsContextMenu(elementRef, contextMenuActions, target);

  const resolvedBadgeCount = resolveThunk(badgeCount);

  return (
    <UIHolder
      ref={elementRef}
      action={action}
      target={target}
      className={className}
      $isActive={isActive}
      $requiresReconnection={requiresReconnection}
    >
      <UILabelBody
        data-tooltip={
          requiresReconnection
            ? `${name} sync has stopped. You can re-enable ${name} notification sync in Settings`
            : undefined
        }
      >
        {requiresReconnection && (
          <UIIcon $isDanger={true}>
            <IconRefreshCcwAlert />
          </UIIcon>
        )}
        {icon && <UIIcon>{icon}</UIIcon>}

        <UIName>{name}</UIName>
      </UILabelBody>

      {!!resolvedBadgeCount && <UICount>{resolvedBadgeCount}</UICount>}
      {additionalShortcut && (
        <Shortcut
          shortcut={additionalShortcut}
          noLabel
          callback={() => {
            runAction(action, context);
          }}
        />
      )}
    </UIHolder>
  );
});

const UILabelBody = styled.div`
  ${theme.typo.content.medium};
  min-width: 0;
  flex-grow: 1;

  display: flex;
  gap: 8px;
  align-items: center;
`;

const UICount = styled.div`
  ${theme.box.panel.badge.size.padding.radius};
  min-width: 4ch;

  ${theme.colors.layout.divider.asBg};
  ${theme.typo.label.semibold}
  text-align: center;
  justify-content: center;
`;

const UIHolder = styled(ActionTrigger)<{ $isActive: boolean; $requiresReconnection?: boolean }>`
  display: flex;
  align-items: center;
  ${theme.box.control.sidebar.size.padding.radius};
  ${theme.common.clickable};
  ${theme.font.medium};

  &:hover {
    ${() => activeStyles}
  }

  ${(props) => props.$isActive && activeStyles};
  ${(props) => props.$requiresReconnection && reconnectionStyles};
`;

const UIIcon = styled.div<{ $isDanger?: boolean }>`
  font-size: 1.2em;
  ${(props) =>
    props.$isDanger &&
    css`
      ${theme.colors.status.danger.asColor}
    `}
`;

const UIName = styled.div`
  ${theme.common.ellipsisText};
`;

const activeStyles = css`
  background-color: #8882;
`;

const reconnectionStyles = css`
  ${theme.colors.status.danger.opacity(0.05).asBg};
`;
