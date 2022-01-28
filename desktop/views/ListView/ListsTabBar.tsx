import React from "react";
import styled from "styled-components";

import { inboxList } from "@aca/desktop/domains/list/preconfigured";

import { ListTabLabel } from "./ListTabLabel";

interface Props {
  activeListId: string;
}

export function ListsTabBar({ activeListId }: Props) {
  return (
    <UIHolder>
      <ListTabLabel list={inboxList} count={0} isActive={activeListId === "inbox"} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 24px;
`;
