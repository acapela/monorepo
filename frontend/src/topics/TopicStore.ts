import { createSharedStateContext } from "~shared/sharedState";

interface State {
  currentlyReplyingToMessageId: string | null;
}

export const [TopicStoreContext, useTopicStore] = createSharedStateContext<State>(() => ({
  currentlyReplyingToMessageId: null,
}));
