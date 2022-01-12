import { Editor } from "@tiptap/react";
import React from "react";

import { createStoreContext } from "@aca/shared/sharedState";

interface State {
  currentlyReplyingToMessageId: string | null;
  editedMessageId: string | null;
  firstUnreadMessageElement: HTMLElement | null;
  editorRef: React.RefObject<Editor> | null;
}

export const [TopicStoreContext, useTopicStoreContext] = createStoreContext<State>(() => ({
  currentlyReplyingToMessageId: null,
  editedMessageId: null,
  firstUnreadMessageElement: null,
  editorRef: null,
}));
