import React from "react";
import styled from "styled-components";

import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";

import { ListsTabBar } from "./ListsTabBar";

interface Props {
  listId: string;
}

export function ListView({ listId }: Props) {
  return (
    <TraySidebarLayout>
      <UITabsBar>
        <ListsTabBar activeListId={listId} />
      </UITabsBar>
      Active list {listId}
    </TraySidebarLayout>
  );
}

const UITabsBar = styled.div`
  padding-top: 2px;
  padding-bottom: 24px;
`;
