import React from "react";
import styled from "styled-components";

import { deleteNotificationList, renameNotificationList } from "@aca/desktop/actions/lists";
import { getDb } from "@aca/desktop/clientdb";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";
import { styledObserver } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";

interface Props {
  listId: string;
  className?: string;
}

export const ListEditTools = styledObserver(({ listId, className }: Props) => {
  const list = getDb().notificationList.assertFindById(listId);

  return (
    <UIHolder className={className}>
      <ActionIconButton action={renameNotificationList} target={list} showTitleInTooltip />
      <ActionIconButton action={deleteNotificationList} target={list} showTitleInTooltip kind="primarySubtle" />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  ${theme.spacing.actions.asGap}
`;
