import { generateHTML } from "@tiptap/html";
import { richEditorExtensions } from "~richEditor/preset";
import { RichEditorNode } from "./types";

export function convertRichEditorContentToHtml(content: RichEditorNode) {
  return generateHTML(content, richEditorExtensions);
}
