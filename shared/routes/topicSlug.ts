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

function pickFirstSentenceOrWords(content: string, maxWordsCount = 10) {
  const [firstSentence] = content.split(".");

  return firstSentence.split(" ").slice(0, maxWordsCount).join(" ").replace(/ +/, " ");
}

export function getTopicNameFromContent(firstMessageContent: RichEditorNode, wordsCount?: number) {
  const snippet = getTextSnippetFromMessageContent(firstMessageContent);

  if (!snippet) return null;

  const shortSnippet = pickFirstSentenceOrWords(snippet, wordsCount);

  return shortSnippet;
}

export function getTopicSlug(firstMessageContent: RichEditorNode, topicName?: string): string {
  if (topicName) {
    return slugifySync(pickFirstSentenceOrWords(topicName), "topic");
  }

  const topicNameFromContent = getTopicNameFromContent(firstMessageContent);

  if (!topicNameFromContent) {
    return "topic";
  }

  return slugifySync(topicNameFromContent, "topic");
}
