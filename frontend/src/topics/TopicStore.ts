import { createSharedStateContext } from "~shared/sharedState";

interface State {
  topicId: string;
  currentlyReplyingToMessageId: string | null;
}

interface ContextProviderProps {
  topicId: string;
}

export const [TopicStoreContext, useTopicStore] = createSharedStateContext<State, ContextProviderProps>(
  ({ topicId }) => ({
    topicId,
    currentlyReplyingToMessageId: null,
  })
);
