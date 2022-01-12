import { JSONContent } from "@tiptap/core";
import { uniqBy } from "lodash";

import { getIsContentNodeOfType, getNodesFromContentByType } from "@aca/richEditor/content/helper";
import { RichEditorNodeTypedNode } from "@aca/richEditor/content/types";
import { REQUEST_TYPES, RequestType } from "@aca/shared/requests";
import { EditorMentionData } from "@aca/shared/types/editor";

export const MENTION_TYPE_KEY = "mention";

export const getMentionNodesFromContent = (content: JSONContent) =>
  getNodesFromContentByType<{ data: EditorMentionData }>(content, MENTION_TYPE_KEY);

export const getRequestMentionDataFromContent = (content: JSONContent) =>
  getMentionNodesFromContent(content)
    .map((node) => node.attrs.data)
    .filter((mention) => REQUEST_TYPES.includes(mention.type as never)) as EditorMentionData<RequestType>[];

export const getPerUserRequestMentionDataFromContent = (content: JSONContent) =>
  uniqBy(getRequestMentionDataFromContent(content), (data) => data.userId);

export function getIsMentionNode(content: JSONContent): content is RichEditorNodeTypedNode<{
  data: EditorMentionData;
}> {
  return getIsContentNodeOfType<{ data: EditorMentionData }>(content, "mention");
}
