import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { IconFolder } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

interface Props {
  action: ActionData;
  target?: unknown;
  className?: string;
  isActive?: boolean;
  badgeCount?: number;
}

export const SidebarItem = observer(function SidebarItem({
  action,
  target,
  className,
  isActive = false,
  badgeCount,
}: Props) {
  const context = createActionContext(target, { isContextual: true });
  const { name, icon = <IconFolder /> } = resolveActionData(action, context);
  return (
    <UIHolder action={action} target={target} className={className} $isActive={isActive}>
      <UILabelBody>
        {icon && <UIIcon>{icon}</UIIcon>}
        {name}
      </UILabelBody>
      {!!badgeCount && <UICount>{badgeCount}</UICount>}
    </UIHolder>
  );
});

const UILabelBody = styled.div`
  ${theme.typo.content.medium};
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

  ${UILabelBody} {
    /* ${theme.typo.secondaryTitle}; */
  }
`;

const UIIcon = styled.div`
  font-size: 1.2em;
`;

const activeStyles = css`
  background-color: #fff1;

  ${UICount} {
    /* background-color: transparent; */
  }
`;
