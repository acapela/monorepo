import { JSONContent } from "@tiptap/core";
import { uniqBy } from "lodash";

import { getIsContentNodeOfType, getNodesFromContentByType } from "~richEditor/content/helper";
import { RichEditorNodeWithAttributes } from "~richEditor/content/types";
import { EditorMentionData } from "~shared/types/editor";
import { REQUEST_TYPES, RequestType } from "~shared/types/mention";

export const MENTION_TYPE_KEY = "mention";

export const getMentionNodesFromContent = (content: JSONContent) =>
  getNodesFromContentByType<{ data: EditorMentionData }>(content, MENTION_TYPE_KEY);

export const getRequestMentionDataFromContent = (content: JSONContent) =>
  getMentionNodesFromContent(content)
    .map((node) => node.attrs.data)
    .filter((mention) => REQUEST_TYPES.includes(mention.type as never)) as EditorMentionData<RequestType>[];

export const getUniqueRequestMentionDataFromContent = (content: JSONContent) =>
  uniqBy(getRequestMentionDataFromContent(content), (data) => data.userId);

export function getIsMentionNode(content: JSONContent): content is RichEditorNodeWithAttributes<{
  data: EditorMentionData;
}> {
  return getIsContentNodeOfType<{ data: EditorMentionData }>(content, "mention");
}
