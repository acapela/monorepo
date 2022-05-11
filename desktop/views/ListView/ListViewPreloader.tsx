import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import { getCollapsedGroupedElementsInList } from "@aca/desktop/actions/views/list";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { uiStore } from "@aca/desktop/store/ui";
import { useLeadingDebouncedValue } from "@aca/shared/hooks/useDebouncedValue";

// Determines how many notifications around the focused one should be loaded
const PRELOAD_NEIGHBOR_COUNT = 2;

const extractNotifications = (elements: NotificationOrGroup[]) =>
  elements
    .filter(({ id }) => uiStore.visibleRowIds.has(id))
    .map((element) => (getIsNotificationsGroup(element) ? element.notifications[0] : element));

export const ListViewPreloader = observer(({ list }: { list: NotificationsList }) => {
  const focusedTarget = useLeadingDebouncedValue(uiStore.focusedTarget, 50);

  const visibleFocusedNotificationNeighbors = computed<NotificationEntity[]>(() => {
    if (!uiStore.isAppFocused) {
      return [];
    }

    const groupedElements = getCollapsedGroupedElementsInList(list);
    const targetIndex = groupedElements.findIndex(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (element) => focusedTarget && element.id === (focusedTarget as any).id
    );

    const isAnyNotificationRowFocused = targetIndex != -1;
    if (!isAnyNotificationRowFocused) {
      const firstVisibleRowIndex = groupedElements.findIndex((element) => uiStore.visibleRowIds.has(element.id));
      return extractNotifications(groupedElements.slice(firstVisibleRowIndex, PRELOAD_NEIGHBOR_COUNT));
    }

    return extractNotifications(
      groupedElements.slice(targetIndex - PRELOAD_NEIGHBOR_COUNT, targetIndex + PRELOAD_NEIGHBOR_COUNT)
    );
  }).get();

  return (
    <>
      {visibleFocusedNotificationNeighbors.map((notification) => (
        <PreloadEmbed key={notification.id} url={notification.url} priority={PreviewLoadingPriority.next} />
      ))}
    </>
  );
});
