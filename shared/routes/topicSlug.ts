/**
 * Topic handle has format of:
 *
 * any-human-familiar-part-<UUID-WITHOUT-DASHES>
 *
 */

import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { slugifySync } from "~shared/slugify";

/**
 * If topic has no title - we prepare slug from text snippet. To do that we'll try to take content from it.
 */
function getTextSnippetFromMessageContent(content: RichEditorNode): string | null {
  if (content.text) {
    return content.text;
  }

  if (content.type === "paragraph") {
    return convertMessageContentToPlainText(content);
  }

  if (content.content) {
    for (const node of content.content) {
      const childText = getTextSnippetFromMessageContent(node);

      if (childText) {
        return childText;
      }
    }
  }

  return null;
}

export function getTopicSlug(firstMessageContent: RichEditorNode, topicName?: string): string {
  if (topicName) {
    return slugifySync(topicName, "topic");
  }

  const snippet = getTextSnippetFromMessageContent(firstMessageContent);

  if (!snippet) {
    return "topic";
  }

  return slugifySync(snippet, "topic");
}
