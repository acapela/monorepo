import { RichEditorNode } from "./types";

/**
 * Types of nodes that should indicate new lines in plain text.
 */
const newLineNodeTypes = ["paragraph", "bulletList", "listItem", "code", "codeBlock", "blockQuote", "hardBreak"];

function normalizePlainTextOutput(plainText: string) {
  return plainText.replace(/\n{2,}/, `\n`).trim();
}

function recursiveConvertMessageContentToPlainText(content: RichEditorNode): string[] {
  const plainTextParts: string[] = [];
  if (newLineNodeTypes.includes(content.type)) {
    plainTextParts.push("\n");
  }

  if (content.text) {
    plainTextParts.push(content.text);
  }

  if (content.type == "emoji") {
    plainTextParts.push(content.attrs?.data?.emoji ?? "");
  }

  if (content.content) {
    plainTextParts.push(
      ...content.content.flatMap((childNode) => recursiveConvertMessageContentToPlainText(childNode))
    );
  }

  return plainTextParts;
}

export function convertMessageContentToPlainText(content: RichEditorNode): string {
  const plainText = recursiveConvertMessageContentToPlainText(content).join("");
  return normalizePlainTextOutput(plainText);
}
