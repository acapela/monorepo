import { measureTime } from "~shared/dev";

import { RichEditorNode } from "./types";

/**
 * Types of nodes that should indicate new lines in plain text.
 */
const newLineNodeTypes = ["paragraph", "bulletList", "listItem", "code", "codeBlock", "blockQuote", "hardBreak"];

function normalizePlainTextOutput(plainText: string) {
  return plainText.replace(/\n{2,}/, `\n`).trim();
}

export function recursiveConvertMessageContentToPlainText(
  content: RichEditorNode,
  isRoot: boolean,
  plainTextParts: string[]
) {
  if (newLineNodeTypes.includes(content.type)) {
    plainTextParts.push("\n");
  }

  if (content.text) {
    plainTextParts.push(content.text);
  }

  if (content.content) {
    for (const childNode of content.content) {
      recursiveConvertMessageContentToPlainText(childNode, false, plainTextParts);
    }
  }

  if (isRoot) {
    const plainText = plainTextParts.join("");
    return normalizePlainTextOutput(plainText);
  }
}

export function convertMessageContentToPlainText(content: RichEditorNode): string {
  const end = measureTime("mess");
  const result = recursiveConvertMessageContentToPlainText(content, true, []) as string;
  end();

  return result;
}
