import React from "react";
import styled from "styled-components";

import { NotificationsList } from "@aca/desktop/domains/list/defineList";

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
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 24px;
`;
