import { RichEditorContent } from "./types";
import { JSONContent } from "@tiptap/react";

function hasContentNodeAnyTextContent(node: JSONContent): boolean {
  if (node.text && node.text.length > 0) return true;

  if (!node.content) return false;

  return node.content.some(hasContentNodeAnyTextContent);
}

export function isRichEditorContentEmpty(content: RichEditorContent): boolean {
  return !hasContentNodeAnyTextContent(content);
}
