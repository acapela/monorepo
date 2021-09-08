import { createStoreContext } from "~shared/sharedState";

interface State {
  currentlyReplyingToMessageId: string | null;
  editedMessageId: string | null;
}

export const [TopicStoreContext, useTopicStoreContext] = createStoreContext<State>(() => ({
  currentlyReplyingToMessageId: null,
  editedMessageId: null,
}));
