import React from "react";
import styled from "styled-components";

import { preconfiguredLists } from "@aca/desktop/domains/list/preconfigured";

import { ListTabLabel } from "./ListTabLabel";

interface Props {
  activeListId: string;
}

export function ListsTabBar({ activeListId }: Props) {
  return (
    <UIHolder>
      {preconfiguredLists.map((list) => {
        return <ListTabLabel key={list.id} list={list} activeListId={activeListId} />;
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 24px;
`;
