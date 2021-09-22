import { JSONContent } from "@tiptap/core";

import { getIsContentNodeOfType, getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNodeWithAttributes } from "~richEditor/content/types";
import { EditorMentionData } from "~shared/types/editor";

export function getMentionNodesFromContent(content: JSONContent) {
  const mentionNodes = getNodesFromContentByType<{ data: EditorMentionData }>(content, "mention");

  return mentionNodes;
}

export function getIsMentionNode(content: JSONContent): content is RichEditorNodeWithAttributes<{
  data: EditorMentionData;
}> {
  return getIsContentNodeOfType<{ data: EditorMentionData }>(content, "mention");
}
