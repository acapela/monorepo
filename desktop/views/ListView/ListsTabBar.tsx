import React from "react";
import styled from "styled-components";

import { createNotificationList } from "@aca/desktop/actions/lists";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";

import { ListTabLabel } from "./ListTabLabel";

interface Props {
  activeListId: string;
  lists: NotificationsList[];
}

export function ListsTabBar({ lists, activeListId }: Props) {
  return (
    <UIHolder>
      {lists.map((list) => {
        return <ListTabLabel key={list.id} list={list} activeListId={activeListId} />;
      })}
      <ActionIconButton action={createNotificationList} showTitleInTooltip />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;
