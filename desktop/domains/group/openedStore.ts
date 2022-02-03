import { makeAutoObservable } from "mobx";

import { toggleElementInArray } from "@aca/shared/array";

/**
 * This keeps information about which groups are opened (aka toggled) and making their notifications visible.
 */
export const openedNotificationsGroupsStore = makeAutoObservable({
  openedIds: [] as string[],
  toggleOpen(id: string) {
    return toggleElementInArray(openedNotificationsGroupsStore.openedIds, id);
  },
  open(id: string) {
    if (!openedNotificationsGroupsStore.getIsOpened(id)) {
      openedNotificationsGroupsStore.openedIds.push(id);
    }
  },
  getIsOpened(id: string) {
    return openedNotificationsGroupsStore.openedIds.includes(id);
  },
});
