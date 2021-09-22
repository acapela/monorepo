import { JSONContent } from "@tiptap/react";

import { getIsMentionNode } from "~frontend/../../shared/editor/mentions";

/**
 * Will return part of the content of message that includes mention to given user.
 *
 * Example:
 * assuming you have nested content like
 * """"
 * Hi
 * - some list
 *   - some more nested
 *     - here is @mention to you
 * """"
 *
 * It will return
 * "here is @mention to you"
 *
 * content node.
 */
export function getMessageMentionSnippet(contentNode: JSONContent, userId: string): JSONContent | null {
  if (getIsMentionNode(contentNode)) return null;

  if (!contentNode.content) return null;

  for (const child of contentNode.content) {
    if (getIsMentionNode(child) && child.attrs.data.userId === userId) {
      return contentNode;
    }

    const childSnippet = getMessageMentionSnippet(child, userId);

    if (childSnippet) return childSnippet;
  }

  return null;
}
