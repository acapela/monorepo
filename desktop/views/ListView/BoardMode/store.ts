import { makeAutoObservable, observable } from "mobx";

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
    draggedItem: null as DraggedItemInfo | null,
    dragReplacePreview: null as DragReplacePreview | null,
    dragPosition: null as TempPosition | null,
  },
  {
    draggedItem: observable.ref,
    dragReplacePreview: observable.ref,
    dragPosition: observable.ref,
  }
);

export interface TempPosition {
  item: NotificationOrGroup;
  listId: string;
  index: number;
}

export const tempPositionBox = observable.box<TempPosition | null>(null);
