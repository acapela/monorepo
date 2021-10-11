import { JSONContent } from "@tiptap/core";
import { uniqBy } from "lodash";

import { getIsContentNodeOfType, getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNodeWithAttributes } from "~richEditor/content/types";
import { EditorMentionData } from "~shared/types/editor";

export const MENTION_TYPE_KEY = "mention";

export function getMentionNodesFromContent(content: JSONContent) {
  const mentionNodes = getNodesFromContentByType<{ data: EditorMentionData }>(content, MENTION_TYPE_KEY);

  return mentionNodes;
}

export const getUniqueMentionDataFromContent = (content: JSONContent) =>
  uniqBy(
    getMentionNodesFromContent(content).map((node) => node.attrs.data),
    (data) => data.userId
  );

export function getIsMentionNode(content: JSONContent): content is RichEditorNodeWithAttributes<{
  data: EditorMentionData;
}> {
  return getIsContentNodeOfType<{ data: EditorMentionData }>(content, "mention");
}
