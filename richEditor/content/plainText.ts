import { RichEditorNode } from "./types";

/**
 * Types of nodes that should indicate new lines in plain text.
 */
const newLineNodeTypes = ["paragraph", "bulletList", "listItem", "code", "codeBlock", "blockQuote", "hardBreak"];

function normalizePlainTextOutput(plainText: string) {
  return plainText.replace(/\n{2,}/, `\n`).trim();
}

export function convertMessageContentToPlainText(content: RichEditorNode, isRoot = true) {
  let plainText = "";

  if (newLineNodeTypes.includes(content.type)) {
    plainText += "\n";
  }

  if (content.text) {
    plainText += content.text;
  }

  if (content.content) {
    for (const childNode of content.content) {
      plainText += convertMessageContentToPlainText(childNode, false);
    }
  }

  if (isRoot) {
    return normalizePlainTextOutput(plainText);
  }

  return plainText;
}
