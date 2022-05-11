import { observer } from "mobx-react";
import React from "react";

import { cachedComputed } from "@aca/clientdb";
import { getCollapsedGroupedElementsInList } from "@aca/desktop/actions/views/list";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { uiStore } from "@aca/desktop/store/ui";
import { useLeadingDebouncedValue } from "@aca/shared/hooks/useDebouncedValue";

// Determines how many notifications around the focused one should be loaded
const PRELOAD_NEIGHBOR_COUNT = 3;

const extractNotifications = (elements: NotificationOrGroup[]) =>
  elements
    .filter(({ id }) => uiStore.visibleRowIds.has(id))
    .map((element) => (getIsNotificationsGroup(element) ? element.notifications[0] : element));

const getNotificationsToPreload = cachedComputed((list: NotificationsList, target: unknown) => {
  const { visibleRowIds } = uiStore;

  const groupedElements = getCollapsedGroupedElementsInList(list);
  const targetIndex = groupedElements.indexOf(target as NotificationOrGroup);

  const isAnyNotificationRowFocused = targetIndex != -1;
  if (!isAnyNotificationRowFocused) {
    const firstVisibleRowIndex = groupedElements.findIndex((element) => visibleRowIds.has(element.id));
    return extractNotifications(groupedElements.slice(firstVisibleRowIndex, PRELOAD_NEIGHBOR_COUNT));
  }

  return extractNotifications(
    groupedElements.slice(targetIndex - PRELOAD_NEIGHBOR_COUNT, targetIndex + PRELOAD_NEIGHBOR_COUNT)
  );
});

export const ListViewPreloader = observer(({ list }: { list: NotificationsList }) => {
  const debouncedFocusedTarget = useLeadingDebouncedValue(uiStore.focusedTarget, 50);

  if (!debouncedFocusedTarget) return null;

  const visibleFocusedNotificationNeighbors = getNotificationsToPreload(list, debouncedFocusedTarget);

  return (
    <>
      {visibleFocusedNotificationNeighbors.map((notification) => (
        <PreloadEmbed key={notification.id} url={notification.url} priority={PreviewLoadingPriority.next} />
      ))}
    </>
  );
});
