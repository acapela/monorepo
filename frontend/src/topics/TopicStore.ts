import { createStoreContext } from "~shared/sharedState";

interface State {
  currentlyReplyingToMessageId: string | null;
  editedMessageId: string | null;
  firstUnreadMessageElement: HTMLElement | null;
}

export const [TopicStoreContext, useTopicStoreContext] = createStoreContext<State>(() => ({
  currentlyReplyingToMessageId: null,
  editedMessageId: null,
  firstUnreadMessageElement: null,
}));
