import { DndContext, MeasuringStrategy, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { ReactNode } from "react";

import { getDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationStatusLabelEntity } from "@aca/desktop/clientdb/notificationStatusLabel";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { runInBatchedAction } from "@aca/shared/mobx/utils";

import { BoardDragOverlay } from "./Overlay";
import { boardModeStore } from "./store";
import { convertEventInfo, hasItemInActive } from "./types";

interface Props {
  items: NotificationOrGroup[];
  children: ReactNode;
}

function updateNotificationLabel(notification: NotificationEntity, label: NotificationStatusLabelEntity | null) {
  const currentStatus = notification.status;

  if (!currentStatus && !label) return;

  if (!label && currentStatus) {
    currentStatus.remove();
    return;
  }

  if (label && !currentStatus) {
    getDb().notificationStatus.create({ notification_id: notification.id, status_label_id: label.id });
  }

  if (label && currentStatus) {
    currentStatus.update({ status_label_id: label.id });
  }
}

function flattenNotificationOrGroup(notificationOrGroup: NotificationOrGroup) {
  if (getIsNotificationsGroup(notificationOrGroup)) {
    return notificationOrGroup.notifications;
  }

  return [notificationOrGroup];
}

function updateNotificationsOrGroupLabel(
  notificationOrGroup: NotificationOrGroup,
  label: NotificationStatusLabelEntity | null,
  all: NotificationOrGroup[],
  index: number
) {
  const notifications = flattenNotificationOrGroup(notificationOrGroup);

  runInAction(() => {
    for (const notification of notifications) {
      updateNotificationLabel(notification, label);
    }
  });
}

export const BoardSortableContext = observer(function BoardSortableContext({ children, items }: Props) {
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
      onDragEnd={action(({ over, active }) => {
        if (!over) {
          boardModeStore.dragPosition = null;
          return;
        }

        const { label: overLabel, index: newIndex } = convertEventInfo(over);
        const { item: activeItem } = convertEventInfo(active);

        if (!activeItem) {
          console.warn("no item");
        }

        updateNotificationsOrGroupLabel(activeItem, overLabel, items, newIndex);

        // boardModeStore.dragPosition = { item: activeInfo.item, index: overInfo.index, listId: overInfo.listId };
        boardModeStore.dragPosition = null;
      })}
      onDragStart={(event) => {
        const { item, label, index } = convertEventInfo(event.active);

        runInBatchedAction(() => {
          boardModeStore.dragPosition = { item, index: index, label };
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

        if (boardModeStore.dragPosition?.label === overInfo.label) {
          return;
        }

        boardModeStore.dragPosition = { item: activeInfo.item, index: overInfo.index, label: overInfo.label };
      }}
    >
      <BoardDragOverlay />
      {/* <SortableContext items={ids} strategy={verticalListSortingStrategy}> */}
      {children}
      {/* </SortableContext> */}
    </DndContext>
  );
});
