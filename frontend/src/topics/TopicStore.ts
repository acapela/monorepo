import { MessageBasicInfoFragment } from "~gql";
import { createSharedStateContext } from "~shared/sharedState";

interface State {
  currentlyReplyingToMessage: MessageBasicInfoFragment | null;
}

export const [TopicStoreContext, useTopicStore] = createSharedStateContext<State>(() => ({
  currentlyReplyingToMessage: null,
}));
