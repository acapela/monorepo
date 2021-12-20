import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { slugifySync } from "~shared/slugify";

function removeDoubleSpaces(input: string) {
  return input.replace(/ +/g, " ");
}

/**
 * If topic has no title - we prepare slug from text snippet. To do that we'll try to take content from it.
 */
function getTextSnippetFromMessageContent(content: RichEditorNode, targetLength = 30): string | null {
  if (content.text) {
    return content.text;
  }

  if (content.type === "paragraph") {
    return convertMessageContentToPlainText(content);
  }

  if (content.content) {
    let allContent = "";

    for (const node of content.content) {
      const childText = getTextSnippetFromMessageContent(node, targetLength - allContent.length);

      allContent += ` ${childText}`;

      if (allContent.length >= targetLength) return allContent;
    }

    if (!allContent.length) return null;

    return removeDoubleSpaces(allContent);
  }

  return null;
}

/**
 * Shorten a string to less than maxLength characters without truncating words.
 */
function trimLengthWithoutBreakingWords(input: string, maxLength: number) {
  if (input.length <= maxLength) return input;
  return input.substr(0, input.lastIndexOf(" ", maxLength));
}

export function getTopicNameFromContent(firstMessageContent: RichEditorNode) {
  const snippet = getTextSnippetFromMessageContent(firstMessageContent);

  if (!snippet) return null;

  const shortSnippet = trimLengthWithoutBreakingWords(snippet, 50);

  return shortSnippet.trim();
}

const DEFAULT_TOPIC_SLUG = "untitled-request";

export function getTopicSlug(firstMessageContent: RichEditorNode, topicName?: string): string {
  if (topicName) {
    return slugifySync(trimLengthWithoutBreakingWords(topicName, 50), DEFAULT_TOPIC_SLUG);
  }

  const topicNameFromContent = getTopicNameFromContent(firstMessageContent);

  if (!topicNameFromContent) {
    return DEFAULT_TOPIC_SLUG;
  }

  return slugifySync(topicNameFromContent, DEFAULT_TOPIC_SLUG);
}
