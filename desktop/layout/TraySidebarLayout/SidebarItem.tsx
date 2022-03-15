import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { runAction } from "@aca/desktop/domains/runAction";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { IconFolder } from "@aca/ui/icons";
import { Shortcut } from "@aca/ui/keyboard/Shortcut";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";
import { theme } from "@aca/ui/theme";

interface Props {
  action: ActionData;
  target?: unknown;
  className?: string;
  isActive?: boolean;
  badgeCount?: number;
  additionalShortcut?: ShortcutDefinition;
  contextMenuActions?: ActionData[];
}

export const SidebarItem = observer(function SidebarItem({
  action,
  target,
  className,
  isActive = false,
  badgeCount,
  additionalShortcut,
  contextMenuActions = [],
}: Props) {
  const context = createActionContext(target, { isContextual: true });
  const { name, icon = <IconFolder /> } = resolveActionData(action, context);
  const elementRef = useRef<HTMLDivElement>(null);

  useActionsContextMenu(elementRef, contextMenuActions, target);

  return (
    <UIHolder ref={elementRef} action={action} target={target} className={className} $isActive={isActive}>
      <UILabelBody>
        {icon && <UIIcon>{icon}</UIIcon>}
        <UIName>{name}</UIName>
      </UILabelBody>

      {!!badgeCount && <UICount>{badgeCount}</UICount>}
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

const UIHolder = styled(ActionTrigger)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  ${theme.box.control.sidebar.size.padding.radius};
  ${theme.common.clickable};
  ${theme.font.medium};

  &:hover {
    ${() => activeStyles}
  }

  ${(props) => props.$isActive && activeStyles};
`;

const UIIcon = styled.div`
  font-size: 1.2em;
`;

const UIName = styled.div`
  ${theme.common.ellipsisText};
`;

const activeStyles = css`
  background-color: #8882;

  ${UICount} {
    /* background-color: transparent; */
  }
`;
