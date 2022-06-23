import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { composeActionsFromImports, listsActions } from "@aca/desktop/actions/all";
import { goToList } from "@aca/desktop/actions/lists";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
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
      <AnimatePresence>
        {isActive && <UIActiveIndicator presenceStyles={{ opacity: [0, 1], y: [5, 0] }} />}
      </AnimatePresence>
    </UIHolder>
  );
});

const UILabel = styled.div<{ $isActive: boolean }>`
  ${theme.font.medium};
  opacity: 0.8;
  transition: inherit;
`;

const UIHolder = styled(ActionTrigger)`
  position: relative;
  display: flex;
  gap: 8px;

  box-sizing: border-box;

  /* this allows enough space for the active indicator to be shown */

  ${theme.typo.pageTitle}
  ${theme.common.clickable};
  ${theme.transitions.hover()}
  white-space: nowrap;

  &:hover {
    ${UILabel} {
      opacity: 1;
    }
  }
`;

const UICount = styled.div`
  ${theme.font.opacity(0.5)};
`;

const UIActiveIndicator = styled(PresenceAnimator)`
  position: absolute;
  box-sizing: border-box;
  left: 0;
  right: 0;
  top: 100%;
  height: 2px;
  margin-top: 2px;
  ${theme.colors.primary.asBg};
`;
