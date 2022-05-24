import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { createNewBoardColumn } from "@aca/desktop/actions/board";
import { getDb } from "@aca/desktop/clientdb";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionButton } from "@aca/desktop/ui/ActionButton";

import { BoardSortableContext } from "./BoardSortableContext";
import { BoardColumn } from "./Column";
import { CachedScroller } from "./utils/CachedScroller";
import { makeScrollableAncestorsScrollMeasurmentsCached } from "./utils/scrollMeasureCache";
import { makeWindowMeasureCached } from "./utils/windowMeasureCache";

interface Props {
  list: NotificationsList;
}

export const BoardMode = observer(function BoardMode({ list }: Props) {
  const notificationGroups = list.getAllGroupedNotifications();

  const labels = getDb().notificationStatusLabel.all;

  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    makeWindowMeasureCached(window);
    makeScrollableAncestorsScrollMeasurmentsCached(holderRef.current!);
  }, []);

  return (
    <BoardSortableContext items={notificationGroups}>
      <UIHolder ref={holderRef}>
        <BoardColumn allNotifications={notificationGroups} label={null} />
        {labels.map((label) => {
          return <BoardColumn allNotifications={notificationGroups} label={label} />;
        })}
        <ActionButton action={createNewBoardColumn} />
      </UIHolder>
    </BoardSortableContext>
  );
});

const UIHolder = styled(CachedScroller)`
  display: flex;
  min-height: 0;
  gap: 40px;
  padding: 20px 20px 0;
  overflow-x: auto;
  flex-grow: 1;
`;
