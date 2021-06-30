import { MessageBasicInfoFragment } from "~gql";
import { createSharedStateContext } from "~shared/sharedState";

interface State {
  currentlyReplyingToMessage: MessageBasicInfoFragment | null;
  editedMessageId: string | null;
}

export const [TopicStoreContext, { useSharedState: useTopicStore, useSharedStateSelector: useTopicStoreSelector }] =
  createSharedStateContext<State>(() => ({
    currentlyReplyingToMessage: null,
    editedMessageId: null,
  }));
