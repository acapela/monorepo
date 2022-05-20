import { makeAutoObservable, observable } from "mobx";

import { NotificationStatusLabelEntity } from "@aca/desktop/clientdb/notificationStatusLabel";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";

export interface DragReplacePreview {
  fromListId: string;
  toListId: string;
  atIndex: number;
  activeItem: NotificationOrGroup;
  overItem: NotificationOrGroup;
}

export interface DragInProgress {
  item: NotificationOrGroup;
  sourceListId: string;
  currentListId: string;
  currentIndex: number;
}

export interface DraggedItemInfo {
  item: NotificationOrGroup;
  sourceListId: string;
}

export const boardModeStore = makeAutoObservable(
  {
    dragPosition: null as TempPosition | null,
  },
  {
    dragPosition: observable.ref,
  }
);

export interface TempPosition {
  item: NotificationOrGroup;
  label: NotificationStatusLabelEntity | null;
  index: number;
}

export const tempPositionBox = observable.box<TempPosition | null>(null);
