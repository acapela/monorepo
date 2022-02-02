import { makeAutoObservable } from "mobx";

import { toggleElementInArray } from "@aca/shared/array";

export const openedNotificationsGroupsStore = makeAutoObservable({
  openedIds: [] as string[],
  toggleOpen(id: string) {
    return toggleElementInArray(openedNotificationsGroupsStore.openedIds, id);
  },
  getIsOpened(id: string) {
    return openedNotificationsGroupsStore.openedIds.includes(id);
  },
});
