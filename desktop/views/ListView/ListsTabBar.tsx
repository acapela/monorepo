import React from "react";
import styled from "styled-components";

import { createNotificationList } from "@aca/desktop/actions/lists";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionButton } from "@aca/desktop/ui/ActionButton";

import { ListTabLabel } from "./ListTabLabel";

interface Props {
  activeListId: string;
  lists: NotificationsList[];
}

export function ListsTabBar({ lists, activeListId }: Props) {
  return (
    <UIHolder>
      {lists.map((list) => {
        return <ListTabLabel key={list.id} list={list} isActive={activeListId === list.id} />;
      })}
      <ActionButton action={createNotificationList} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;
