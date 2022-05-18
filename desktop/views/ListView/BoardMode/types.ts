import { Active, Over } from "@dnd-kit/core";

import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";

export interface SortableItemData {
  item: NotificationOrGroup;
  sortable?: SortableInfo;
}

interface SortableInfo {
  containerId: string;
  index: number;
}

export function convertEventInfo(info: Active | Over) {
  const data = info.data.current!;
  const id = info.id;
  const item = data.item as NotificationOrGroup;
  const sortable = data.sortable as SortableInfo;

  return { id, item, sortable, listId: sortable.containerId, index: sortable.index };
}

export function hasItemInActive(info: Active) {
  const data = info.data.current!;

  if (!data) return;

  return !!data.item;
}
