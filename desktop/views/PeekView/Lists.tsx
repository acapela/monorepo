import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getInboxLists } from "@aca/desktop/domains/list/all";

import { ListLabel } from "./ListLabel";

export const Lists = observer(function Lists() {
  const lists = getInboxLists();
  return (
    <UIHolder>
      {lists.map((list) => {
        return <ListLabel key={list.id} list={list} />;
      })}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  flex-wrap: wrap;
  gap: 8px;
`;
