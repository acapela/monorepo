import { Active, Over } from "@dnd-kit/core";

import { NotificationStatusLabelEntity } from "@aca/desktop/clientdb/notificationStatusLabel";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";

export interface SortableItemData {
  item: NotificationOrGroup;
  label: NotificationStatusLabelEntity | null;
}

interface SortableInfo {
  containerId: string;
  index: number;
}

export function convertEventInfo(info: Active | Over) {
  const data = info.data.current!;
  const id = info.id;
  const item = data.item as NotificationOrGroup;
  const label = data.label as NotificationStatusLabelEntity | null;
  const sortable = data.sortable as SortableInfo;

  return { id, item, sortable, label, index: sortable?.index ?? 0 };
}

export function hasItemInActive(info: Active) {
  const data = info.data.current!;

  if (!data) return;

  return !!data.item;
}
