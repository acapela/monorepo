import { DndContext, MeasuringStrategy, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";

import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { runInBatchedAction } from "@aca/shared/mobx/utils";

import { BoardDragOverlay } from "./Overlay";
import { boardModeStore } from "./store";
import { convertEventInfo, hasItemInActive } from "./types";

interface Props {
  items: NotificationOrGroup[];
  children: ReactNode;
}

export const BoardSortableContext = observer(function BoardSortableContext({ children }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.WhileDragging,
          // measure: cachedMeasureRect,
        },
      }}
      onDragEnd={({ over }) => {
        if (!over) {
          boardModeStore.dragPosition = null;
          return;
        }

        // boardModeStore.dragPosition = { item: activeInfo.item, index: overInfo.index, listId: overInfo.listId };
        boardModeStore.dragPosition = null;
      }}
      onDragStart={(event) => {
        const { item, listId, index } = convertEventInfo(event.active);

        runInBatchedAction(() => {
          boardModeStore.dragPosition = { item, index: index, listId };
        });
      }}
      onDragOver={(event) => {
        const { active, over } = event;

        /**
         * Due to our use of virtualized list - it is possible that active item will not be rendered for brief moments.
         * Unmounted actived item clears up it's data, so it would crash.
         *
         * To avoid that - we simply ignore such over events and wait for it to be picked by virtualized list (it seems unnoticable at all).
         */
        if (!hasItemInActive(active)) {
          return;
        }

        const activeInfo = convertEventInfo(active);

        if (!over) {
          boardModeStore.dragPosition = null;
          return;
        }

        const overInfo = convertEventInfo(over);

        if (boardModeStore.dragPosition?.listId === overInfo.listId) {
          return;
        }

        boardModeStore.dragPosition = { item: activeInfo.item, index: overInfo.index, listId: overInfo.listId };
      }}
    >
      <BoardDragOverlay />
      {/* <SortableContext items={ids} strategy={verticalListSortingStrategy}> */}
      {children}
      {/* </SortableContext> */}
    </DndContext>
  );
});
