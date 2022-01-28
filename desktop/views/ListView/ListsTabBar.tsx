import React from "react";
import styled from "styled-components";

import { importantList, inboxList, relevantList } from "@aca/desktop/domains/lists";

import { ListTabLabel } from "./ListTabLabel";

interface Props {
  activeListId: string;
}

export function ListsTabBar({ activeListId }: Props) {
  return (
    <UIHolder>
      <ListTabLabel list={inboxList} count={0} isActive={activeListId === "inbox"} />
      <ListTabLabel list={importantList} count={0} isActive={activeListId === "important"} />
      <ListTabLabel list={relevantList} count={0} isActive={activeListId === "relevant"} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 24px;
`;
