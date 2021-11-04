import { Editor } from "@tiptap/react";
import React from "react";

import { createStoreContext } from "~shared/sharedState";

interface State {
  currentlyReplyingToMessageId: string | null;
  editedMessageId: string | null;
  scrolledMessageId: string | null;
  editorRef: React.RefObject<Editor> | null;
}

export const [TopicStoreContext, useTopicStoreContext] = createStoreContext<State>(() => ({
  currentlyReplyingToMessageId: null,
  editedMessageId: null,
  scrolledMessageId: null,
  editorRef: null,
}));
