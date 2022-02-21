import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { composeActionsFromImports, listsActions } from "@aca/desktop/actions/all";
import { goToList } from "@aca/desktop/actions/lists";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { theme } from "@aca/ui/theme";

interface Props {
  list: NotificationsList;
  isActive?: boolean;
  className?: string;
}

export const ListTabLabel = observer(function ListTabLabel({ isActive = false, list, className }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  useActionsContextMenu(elementRef, composeActionsFromImports(listsActions), list);

  return (
    <UIHolder ref={elementRef} action={goToList} target={list} className={className}>
      <UILabel $isActive={isActive}>{list.name}</UILabel>
      <UICount>{list.getAllNotifications().length}</UICount>
      <UIActiveIndicator $isVisible={isActive} />
    </UIHolder>
  );
});

const UILabel = styled.div<{ $isActive: boolean }>`
  ${(props) => (props.$isActive ? theme.font.bold : theme.font.medium)};

  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const UIHolder = styled(ActionTrigger)`
  position: relative;
  display: flex;
  gap: 8px;

  box-sizing: border-box;

  /* this allows enough space for the active indicator to be shown */
  padding-bottom: 4px;

  ${theme.typo.secondaryTitle}
  ${theme.common.clickable};
  white-space: nowrap;
`;

const UICount = styled.div`
  ${theme.font.opacity(0.5)};
`;

const UIActiveIndicator = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  box-sizing: border-box;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  ${theme.colors.primary.asBg};
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: 0.15s all;
`;
