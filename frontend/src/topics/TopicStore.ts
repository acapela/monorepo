import { MessageDetailedInfoFragment } from "~gql";
import { createSharedStateContext } from "~shared/sharedState";

interface State {
  currentlyReplyingToMessage: MessageDetailedInfoFragment | null;
  editedMessageId: string | null;
}

export const [TopicStoreContext, useTopicStoreContext] = createSharedStateContext<State>(() => ({
  currentlyReplyingToMessage: null,
  editedMessageId: null,
}));
