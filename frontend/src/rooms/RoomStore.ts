import { createStoreContext } from "~shared/sharedState";

interface State {
  newTopicId: string | null;
  editingNameTopicId: string | null;
}

export const [RoomStoreContext, useRoomStoreContext] = createStoreContext<State>(() => ({
  newTopicId: null,
  editingNameTopicId: null,
}));
