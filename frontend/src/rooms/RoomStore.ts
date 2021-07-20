import { createSharedStateContext } from "~shared/sharedState";

interface State {
  newTopicId: string | null;
  editingNameTopicId: string | null;
}

export const [RoomStoreContext, useRoomStoreContext] = createSharedStateContext<State>(() => ({
  newTopicId: null,
  editingNameTopicId: null,
}));
