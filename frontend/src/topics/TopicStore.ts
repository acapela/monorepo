import { MessageDetailedInfoFragment } from "~gql";
import { createStoreContext } from "~shared/sharedState";

interface State {
  currentlyReplyingToMessage: MessageDetailedInfoFragment | null;
  editedMessageId: string | null;
}

export const [TopicStoreContext, useTopicStoreContext] = createStoreContext<State>(() => ({
  currentlyReplyingToMessage: null,
  editedMessageId: null,
}));
