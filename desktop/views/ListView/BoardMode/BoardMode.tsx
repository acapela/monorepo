import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { NotificationsList } from "@aca/desktop/domains/list/defineList";

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

  const first = notificationGroups.slice(0, 10);
  const last = notificationGroups.slice(11, 15);
  const next = notificationGroups.slice(16);

  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    makeWindowMeasureCached(window);
    makeScrollableAncestorsScrollMeasurmentsCached(holderRef.current!);
  }, []);

  return (
    <BoardSortableContext items={notificationGroups}>
      <UIHolder ref={holderRef}>
        <BoardColumn id="Inbox" items={first} />
        <BoardColumn id="Next" items={last} />
        <BoardColumn id="Free moment" items={next} />
        <BoardColumn id="Add column +" items={[]} />
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
