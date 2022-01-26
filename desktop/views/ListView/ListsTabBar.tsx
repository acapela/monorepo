import React from "react";
import styled from "styled-components";

import { navigateToList } from "@aca/desktop/domains/lists";

import { ListTabLabel } from "./ListTabLabel";

interface Props {
  activeListId: string;
}

export function ListsTabBar({ activeListId }: Props) {
  return (
    <UIHolder>
      <ListTabLabel
        label="Inbox"
        count={14}
        isActive={activeListId === "inbox"}
        onClick={() => {
          navigateToList("inbox");
        }}
      />
      <ListTabLabel
        label="Important"
        count={14}
        isActive={activeListId === "important"}
        onClick={() => {
          navigateToList("important");
        }}
      />
      <ListTabLabel
        label="Relevant"
        count={14}
        isActive={activeListId === "relevant"}
        onClick={() => {
          navigateToList("relevant");
        }}
      />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 24px;
`;
